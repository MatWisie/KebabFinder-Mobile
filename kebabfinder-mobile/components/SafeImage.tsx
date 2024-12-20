import React, { useState } from "react";
import { Image, ImageProps, ImageSourcePropType, StyleProp, ImageStyle } from "react-native";

interface SafeImageProps extends Omit<ImageProps, "source"> {
    imageSource: string | number;
}

const SafeImage: React.FC<SafeImageProps> = ({ imageSource, style, ...rest }) => {
    const [currentSource, setCurrentSource] = useState<ImageSourcePropType>(
        typeof imageSource === "string" ? { uri: imageSource } : imageSource
    );

    const handleError: ImageProps["onError"] = () => {
        setCurrentSource(require("../assets/images/image-error.png")); 
    };

    return <Image source={currentSource} style={style} onError={handleError} {...rest} />;
};

export default SafeImage;