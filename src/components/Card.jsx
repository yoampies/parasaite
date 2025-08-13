import { useLocation } from "react-router-dom";
import HomeCard from "./HomeCard";
import ScannerCard from "./ScannerCard";
import RegularCard from "./RegularCard";
import HistoryCard from "./HistoryCard";

function Card({ title, content, imgURL, children, onClick, isSelected }) {
    const location = useLocation();
    const currentPath = location.pathname;

    if (currentPath === "/") {
        return <HomeCard title={title}>{children}</HomeCard>;
    }
    if (currentPath === "/scanner") {
        return <ScannerCard imgURL={imgURL} onClick={onClick} isSelected={isSelected} />;
    }
    if (currentPath === "/history") {
        return <HistoryCard title={title} content={content} imgURL={imgURL} onClick={onClick} />;
    }
    return <RegularCard title={title} content={content} imgURL={imgURL} />;
}

export default Card;