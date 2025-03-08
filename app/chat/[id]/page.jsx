import jwt from 'jsonwebtoken'
import Chat from "./components/Chat";

const SECRET_KEY = process.env.JWT_SECRET; // Environemntally stored unique JWT key used for coding & decoding

export default function page({ params }) {
    const { id } = params // Extract page parameters

    return <>
        <Chat token={id}/>
    </>;
};
