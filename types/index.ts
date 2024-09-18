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
