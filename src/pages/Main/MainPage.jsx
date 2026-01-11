import { LondonTime } from "../../store/LondonTime";
import "./MainPage.css";
import Appstr from "../../socialNet/appstr.svg?url";
import Facebook from "../../socialNet/facebook.svg?url";
import Inst from "../../socialNet/inst.svg?url";
import Spot from "../../socialNet/spotify.svg?url";
import Weibo from "../../socialNet/weibo.svg?url";
import YouTube from "../../socialNet/you.svg?url";
import { useNavigate } from 'react-router-dom';

export const MainPage = () => {
    const navigate = useNavigate();

    const ShopClick = () => {
        navigate(`/shop`)
    }

    return(
        <div className="main-page">
            <div className="london-time">
                <LondonTime color="lime"/>
            </div>
            
            <ul className="main-menu">
                <li>news</li>
                <li>fall/winter 2025 preview</li>
                <li>fall/winter 2025 lookbook</li>
                <li onClick={ShopClick}>shop</li>
                <li>random</li>
                <li>about</li>
                <li>stores</li>
                <li>contact</li>
                <li>mail listing</li>
            </ul>
            
            <ul className="social-icons">
                <li><img src={Appstr} alt="App Store" width={24} height={24}/></li>
                <li><img src={Facebook} alt="Facebook" width={24} height={24}/></li>
                <li><img src={Inst} alt="Instagram" width={24} height={24}/></li>
                <li><img src={Spot} alt="Spotify" width={24} height={24}/></li>
                <li><img src={Weibo} alt="Weibo" width={24} height={24}/></li>
            </ul>
        </div>
    )
}