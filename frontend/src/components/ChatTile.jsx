

export default function ChatTile({index ,message, user}) {


  return (
    <li key={index} className={message.user == user.id ?
      "flex justify-end" : "flex justify-start"
    }>
      <div className={message.user == user.id ? "w-[90%] bg-blue-100 text-black rounded-lg p-2" : "w-[90%] bg-purple-100 text-black rounded-lg p-2"
      }>
        <div className="flex items-center gap-2">
          <img className="w-6 h-6 rounded-full" src={message.avatar} alt="" />
          <span className="text-xs text-gray-500">
            {message.name}
          </span>
        </div>
        <hr className="border-gray-300 my-1" />
        <span>{message.message}</span>
      </div>
    </li>
  )

}

