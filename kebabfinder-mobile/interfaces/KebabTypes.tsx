export interface Kebab {
    id: number;
    name: string;
    address: string;
    coordinates: string;
    logo_link: string;
    open_year: number;
    closed_year: number | null;
    status: string;
    is_craft: boolean;
    building_type: string;
    is_chain: boolean;
    google_review: number | null;
    pyszne_pl_review: number | null;
    created_at: string;
    updated_at: string;
    opening_hour: OpeningHour | null;
    meat_types: MeatType[];
    order_way: OrderWay[]; 
    sauces: Sauce[];
    social_medias: SocialMedia[];
}

export interface MeatType {
    id: number;
    name: string;
    created_at: string | null;
    updated_at: string | null;
    pivot: {
        kebab_id: number;
        meat_type_id: number;
    };
}

export interface OrderWay{
    id: number;
    app_name: string;
    phone_number: string;
    website: string;
}

export interface OpeningHour {
    id: number;
    monday_open: string | null;
    monday_close: string | null;
    tuesday_open: string | null;
    tuesday_close: string | null;
    wednesday_open: string | null;
    wednesday_close: string | null;
    thursday_open: string | null;
    thursday_close: string | null;
    friday_open: string | null;
    friday_close: string | null;
    saturday_open: string | null;
    saturday_close: string | null;
    sunday_open: string | null;
    sunday_close: string | null;
}

export interface Sauce {
    id: number;
    name: string;
    created_at: string | null;
    updated_at: string | null;
    pivot: {
        kebab_id: number;
        sauce_type_id: number;
    };
}

export interface SocialMedia {
    id: number;
    kebab_id: number;
    social_media_link: string;
    created_at: string;
    updated_at: string;
}