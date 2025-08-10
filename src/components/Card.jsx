import { useLocation } from "react-router-dom";
import HomeCard from "./HomeCard";
import HistoryCard from "./HistoryCard";
import ScannerCard from "./ScannerCard";

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
    if (currentPath === "/history") {
        return <HistoryCard title={title} content={content} imgURL={imgURL}/>
    }
    if (currentPath === "/scanner") {
        return <ScannerCard imgURL={imgURL} />
    }
}

export default Card