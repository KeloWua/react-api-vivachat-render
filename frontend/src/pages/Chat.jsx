import { useState, useEffect, useRef } from "react";
import { chat, chatList, chatMessages } from "../services/chat/chat";
import { useAuth } from "../../context/AuthContext";
import ChatTile from "../components/ChatTile";
import { socket } from "../socket";

export default function Chat() {

    const { user } = useAuth();

    const [isConnected, setIsConnected] = useState(false);
    const [newMessage, setNewMessage] = useState('');
    const [chatsList, setChatsList] = useState([]);
    const [onlineCount, setOnlineCount] = useState(0);
    const [currentChat, setCurrentChat] = useState({});
    const [messages, setMessages] = useState([]);

    const bottomRef = useRef(null);

    // =========================
    // SELECT CHAT
    // =========================
    const selectChat = (chat) => {
        setCurrentChat(chat);
    };

    // =========================
    // LOAD CHAT LIST
    // =========================
    const loadChatlist = async () => {
        try {
            const lists = await chatList();
            if (!lists) return;
            setChatsList(lists);
        } catch (err) {
            console.error(err);
        }
    };

    // =========================
    // LOAD CHAT MESSAGES
    // =========================
    const loadChatMessages = async (chatId) => {
        try {
            const lists = await chatMessages(chatId);
            setMessages(lists);
        } catch (err) {
            console.error(err);
        }
    };

    // =========================
    // SEND MESSAGE
    // =========================
    const sendMessage = async () => {
        try {
            if (!currentChat.id || !newMessage.trim()) return;

            const messageData = await chat(
                currentChat.id,
                user.id,
                newMessage
            );

            socket.emit('send_message', {
                chatId: currentChat.id,
                id: messageData.id,
                user: user.id,
                name: user.name,
                avatar: user.avatar,
                message: newMessage,
                createdAt: messageData.createdAt
            });

        } catch (err) {
            console.error(err);
        }
    };

    // =========================
    // JOIN ROOM WHEN CHAT CHANGES
    // =========================
    useEffect(() => {
        if (!currentChat.id) return;

        socket.emit('join_chat', currentChat.id);

    }, [currentChat.id]);

    // =========================
    // LOAD MESSAGES WHEN CHAT CHANGES
    // =========================
    useEffect(() => {
        if (!currentChat.id) return;

        setMessages([]);
        setOnlineCount(0);

        loadChatMessages(currentChat.id);

    }, [currentChat.id]);

    // =========================
    // SOCKET CONNECTION STATUS
    // =========================
    useEffect(() => {

        const handleConnect = () => setIsConnected(true);
        const handleDisconnect = () => setIsConnected(false);

        socket.on('connect', handleConnect);
        socket.on('disconnect', handleDisconnect);


        if (socket.connected) {
            setIsConnected(true);
        }

        return () => {
            socket.off('connect', handleConnect);
            socket.off('disconnect', handleDisconnect);
        };

    }, []);

    // =========================
    // ONLINE COUNT LISTENER
    // =========================
    useEffect(() => {

        socket.on('online_count', setOnlineCount);

        return () => {
            socket.off('online_count');
        };

    }, []);

    // =========================
    // RECEIVE MESSAGE (ONLY CURRENT CHAT)
    // =========================
    useEffect(() => {

        const handleMessage = (msg) => {
            if (msg.chatId === currentChat.id) {
                setMessages(prev => [...prev, msg]);
                setNewMessage('');
            }
        };

        socket.on('receive_message', handleMessage);

        return () => {
            socket.off('receive_message', handleMessage);
        };

    }, [currentChat.id]);

    // =========================
    // AUTO SCROLL
    // =========================
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    console.log(user)
    return (
        <div className="pl-1.5 flex-col items-center">
            {user?
            <>
                {/* CHAT LIST */}
                <div className="mt-5 w-96 h-[200px] bg-gray-500 p-4 flex flex-col rounded-lg">
                    <div className="flex justify-between">
                        <h2>Chats List</h2>
                        <button
                            onClick={loadChatlist}
                            className="bg-blue-200 active:opacity-70 hover:opacity-80 rounded m-1 px-2"
                        >
                            LOAD
                        </button>
                    </div>

                    <ul className="flex-1 overflow-y-auto flex flex-col gap-2 pr-2">
                        {chatsList.map((chat) => (
                            <li
                                key={chat.id}
                                onClick={() => selectChat(chat)}
                                className={
                                    chat.id === currentChat.id
                                        ? "w-[90%] bg-blue-200 text-black rounded-lg p-2 cursor-pointer"
                                        : "w-[90%] bg-gray-200 text-black rounded-lg p-2 cursor-pointer"
                                }
                            >
                                {chat.name}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* CHAT WINDOW */}
                <div className="mt-10 w-96 h-[500px] bg-gray-400 p-4 flex flex-col rounded-lg">

                    <h2 className="mb-2">
                        {isConnected && currentChat.name
                            ? `CONNECTED TO: ${currentChat.name || ''} (${onlineCount} online)`
                            : 'NOT CONNECTED'}
                    </h2>

                    {/* MESSAGES */}
                    <ul className="flex-1 overflow-y-auto flex flex-col gap-2 pr-2">
                        {messages.map((message, index) => (
                            <ChatTile
                                key={message.id || index}
                                message={message}
                                user={user}
                            />
                        ))}
                        <div ref={bottomRef}></div>
                    </ul>

                    {/* INPUT */}
                    <div className="mt-3 flex gap-2">
                        <input
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            type="text"
                            className="flex-1 p-2 text-black bg-white rounded"
                            placeholder="Type a message..."
                        />
                        <button
                            onClick={sendMessage}
                            className="bg-blue-600 text-white px-4 rounded"
                        >
                            Send
                        </button>
                    </div>

                </div>
            </>
            :
            <>
                <div className="p-20 text-center font-bold text-black">
                    Log in to chat with friends!
                </div>
            </>}
        </div>
    );
}
