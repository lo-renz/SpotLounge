import Avatar from "./Avatar";

const Contact = ({ id, username, onClick, selected, online }) => {
    return (
        <div key={id} onClick={() => onClick(id)}
            className={"py-2 pl-4 flex items-center gap-2 cursor-pointer " + (selected ? 'border-l-2 border-green-600 bg-[#1c1717]' : '')}>
            <div className="flex gap-2 py-2 pl-4 items-center">
                <Avatar online={online} username={username} userId={id} />
                <span className='text-white'>{username}</span>
            </div>
        </div>
    )
}

export default Contact