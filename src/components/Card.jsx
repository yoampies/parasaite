import { useLocation } from "react-router-dom";
import HomeCard from "./HomeCard";
import HistoryCard from "./HistoryCard";

function Card({title, content, imgURL, children}) {
    const location = useLocation();
    const currentPath = location.pathname;

    if (currentPath === "/") {
        return (
            <HomeCard title={title}>
                {children}
            </HomeCard>
        )
    }
    return (
        <HistoryCard title={title} content={content} imgURL={imgURL}/>
  )
}

export default Card