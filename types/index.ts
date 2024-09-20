export interface IMessage {
    id: number;
    user: number;
    message: string;
    created_at: string;
}

export interface IRegion {
    value: any;
    id: number;
    name: string;
}

export interface IPost {
    title: string;
    content: string;
    address: string;
    street: number;
    price: string;
    type: number;
    contact: string;
    created_at: string;
    image_url: string;
    price_type: string;
    status: string;
    user: number;
}

export interface LoginResponse {
    access: string;
}

export interface IUser {
    created_at: string;
    email: string;
    image_path: string;
    language: string;
    password: string;
    phone_number: string;
    status: string;
    tg_status: string;
    user_id: number;
    username: string;
}
