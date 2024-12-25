import { View, Text, TextInput, Alert, Button, StyleSheet, FlatList, TouchableOpacity, Modal, TouchableWithoutFeedback, Keyboard } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SendCommentsGetRequest, SendCommentPostRequest } from '@/helpers/commentsHelper';
import { Comment, CommentPost } from '@/interfaces/CommentsTypes';
import { Fontisto } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { handleRequestError } from '@/helpers/errorHelper';
import { UserAvatar } from '@/helpers/userHelper';
import { FormatDate } from '@/helpers/dateHelper';

const CommentsComponent: React.FC<{ kebabId: number, endReached: boolean }> = ({ kebabId, endReached }) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [isAddCommentVisible, setAddCommentVisible] = useState(false);
    const [userName, setUserName] = useState<string | null>(null);
    const [token, setToken] = useState<string>('');
    const [newComment, setNewComment] = useState('');
    const [commentsToShow, setCommentsToShow] = useState<number>(5);
    const getComments = async () => 
        {
            try {
                const commentsResponse = await SendCommentsGetRequest(kebabId);
                if (commentsResponse.status >= 200 && commentsResponse.status < 300) {
                    setComments(commentsResponse.data);
                }
              } catch (error) {
                handleRequestError(error);
              }
        }
    useEffect(() =>{
        const getUserDataName = async () => {
            const storedUserName = await AsyncStorage.getItem('userName');
            setUserName(storedUserName); 
            const token = await AsyncStorage.getItem('userToken') ?? '';
            setToken(token); 
        };
        getComments();
        getUserDataName();
    }, [kebabId]);

    useEffect(() =>{
        loadMoreComments();
    }, [endReached])

    const handleCommentPost = async () => {
        if (!newComment) {
            Alert.alert('Error', 'Please fill comment content');
            return;
          }
        try {
            const commentPostData: CommentPost = {
                content: newComment
              };
        const response = await SendCommentPostRequest(token, commentPostData, kebabId);
    
        if (response.status >= 200 && response.status < 300) {
            getComments();
            setAddCommentVisible(false);
            setNewComment('');
        } else {
            Alert.alert('Error', response.data.message || 'Failed to add comment');
        }
        } catch (error) {
            handleRequestError(error);
        }}

    const renderComment = ({ item }: { item: Comment }) => {
        return (
            <View style={styles.commentContainer}>
                <UserAvatar userName={item.user.name} size={40}/>
                <View style={[styles.commentContent, {width:'100%'}]}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1 }}>
                        <Text style={styles.userName}>{item.user.name}</Text>
                        <Text style={{ marginRight:60 }}>{FormatDate(item.created_at)}</Text>
                    </View>
                    <Text style={styles.commentText}>{item.content}</Text>
                </View>
            </View>
        );
    };

    const loadMoreComments = () => {
        if (comments.length > commentsToShow) {
            setCommentsToShow(prev => prev + 5);
        }
    };

    return (
        <View style={{flex:1, width: '100%', marginTop:20, backgroundColor:'#88d7eb', borderRadius:40}}>
            <View style={{backgroundColor:'#7FC7D9', borderRadius:40, flexDirection:'row'}}>
                <TouchableOpacity
                    style={styles.addCommentButton}
                    onPress={() => setAddCommentVisible(true)}
                >
                    <Fontisto name="comment" size={30} color="blue" />
                </TouchableOpacity>
                <Text style={{verticalAlign:'middle'}}>Comments</Text>
            </View>
            <FlatList
                data={comments.slice(0, commentsToShow)}
                nestedScrollEnabled={true}
                renderItem={renderComment}
                keyExtractor={(item) => item.id.toString()}
                style={styles.container}
            />
      <Modal
        visible={isAddCommentVisible}
        transparent={true}
        animationType='fade'
        onRequestClose={() => setAddCommentVisible(false)} 
      >
        <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss(); setAddCommentVisible(false); }}>

            <View style={[styles.modalOverlay]}>
                <View style={[styles.modalContent,{width:'90%'}]}>
                    <View style={{flexDirection: 'row'}}>
                        <UserAvatar userName={userName || ''} size={40} />
                        <View style={[styles.commentContent, {width:'80%'}]}>
                            <Text style={styles.userName}>{userName}</Text>
                            <TextInput
                                style={[
                                    styles.commentText,
                                    { backgroundColor: '#e3e8e8', height: 100, textAlignVertical: 'top' }
                                ]}
                                multiline={true} 
                                numberOfLines={4} 
                                value={newComment}
                                onChangeText={setNewComment}
                                placeholder="Write your comment here"
                            />
                        </View>
                    </View>
                            <View style={{ alignItems: 'flex-end', marginTop:10 }}>
                                <Button title="Post" onPress={handleCommentPost}/>
                            </View>
                    </View>
            </View>
        </TouchableWithoutFeedback>
      </Modal>
        </View>
        
    );
  };
  
  const styles = StyleSheet.create({
    container: {
        padding: 10,
        width:'100%'
    },
    commentContainer: {
        flexDirection: 'row',
        marginBottom: 10,
        paddingHorizontal: 10, 
        width: '100%', 
    },
    avatarContainer: {
        marginRight: 10,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'gray',
    },
    commentContent: {
        flexDirection: 'column',
    },
    userName: {
        fontWeight: 'bold',
    },
    commentText: {
        marginTop: 5,
        fontSize: 14,
        width:'100%',
    },
    addCommentButton: {
        alignSelf: 'flex-start',
        padding: 10,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center', 
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#ffffff',
        borderRadius: 20,
        padding: 20,
    },
    commentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },});
  
  export default CommentsComponent;