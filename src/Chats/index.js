import RoomItem from "./roomitem"
import { useState,useEffect,useRef } from "react"
import axios from "axios";
import { useNavigate } from "react-router-dom";
import{ UserAddOutlined,CloseOutlined,PlusOutlined} from '@ant-design/icons'
export default function Chats(props){
    const [chatlist,setChatList]=useState([]);
    const [add,setAdd]=useState(false);
    const [nonempty,setEmpty]=useState(true);
    const [userCheck,setUserCheck]=useState(true);
    const navigate=useNavigate();
    const formRef=useRef(null);
    useEffect(()=>{

        axios.get("https://chatfree-server.onrender.com/getChats",{params:{
            "user1":props.username
        }}).then(res=>{
            let chatData={};
            let data=res.data;
            for(let i=0;i<data.length;i++)
            {
                if(data[i].to!==props.username)
                chatData[data[i].to]="a";
                else
                chatData[data[i].from]="a";
            }
            let keys=Object.keys(chatData)
            for(let i=0;i<keys.length;i++)
            {
                setChatList(list=>[...list,<RoomItem name={keys[i]} global={false}/>])
            }
        }).catch(e=>console.log(e))
    },[])
    let handleClick=()=>{
        setAdd(true);
    }
    let handleSubmit=e=>{
        e.preventDefault();
        axios.post("https://chatfree-server.onrender.com/findUser",{
            "user":formRef.current[0].value
        }).then(res=>{
            if(res.data)
            {
                setUserCheck(true);
                navigate("/private/"+formRef.current[0].value);
            }
            else
            {
                setUserCheck(false);
            }
        }).catch(e=>console.log(e))
    }
    return (
        <div className="outlin
        w-[40%] md:w-[60%] sm:w-[80%] h-[450px] sm:h-[45vh]
        px-6 py-3
        overflow-scroll
        backdrop-blur-sm
        bg-[#2121218d]
        flex flex-col
        surface
        ">
            <div className="relative outlin p-2 text-2xl flex justify-center">
                <div className="font-semibold">
                    Chats
                </div>
                <div className="absolute right-2 outlin cursor-pointer"
                onClick={handleClick}>
                    <UserAddOutlined />
                </div>
            </div>
            <form ref={formRef} className={`mb-1 outline-[.1px] ${add?'h-12 outline':'h-0'} ${userCheck?'':'text-red-500 outline-red-500 '} transition-all flex `}
            onSubmit={handleSubmit}
            >
                <input required className=" text-base outline-none px-3 py-0   w-full bg-inherit"  type="text"
                onChange={e=>{
                    setUserCheck(true);
                    if(e.target.value.length===0)
                    {
                        setEmpty(true);
                    }
                    else
                    {
                        setEmpty(false);
                    }
                }}
                />
                <div className="mr-2 ml-2 cursor-pointer outlin h-full flex justify-center items-center">
                {add && nonempty && <CloseOutlined onClick={()=>{setAdd(false)}} className="text-2xl"/>}
                {add && !nonempty && <PlusOutlined onClick={handleSubmit} className="text-2xl"/>}
                </div>
            </form>
            <RoomItem name="Global Chat" global={true}/>

            {/* Below is the Chat list */}

            <div className="mt-[-3.5px] h-full overflow-scroll">
            {chatlist}
            </div>




            

        </div>
    )
}