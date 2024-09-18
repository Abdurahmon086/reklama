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
    address: string;
    contact: string;
    content: string;
    created_at: string;
    image_url: string;
    price: string;
    price_type: string;
    status: string;
    street: number;
    title: string;
    type: number;
    user: number;
}
