import { useLocation } from 'react-router-dom';
import { ReactElement } from 'react';
import { CardProps } from '../types';

import HomeCard from './HomeCard';
import ScannerCard from './ScannerCard';
import RegularCard from './RegularCard';
import HistoryCard from './HistoryCard';

function Card({ 
  title = '', 
  content = '', 
  imgURL = '', 
  children = null, 
  onClick = () => {}, 
  isSelected = false 
}: CardProps) {
  const { pathname } = useLocation();

  const componentsByPath: Record<string, ReactElement> = {
    '/': <HomeCard title={title}>{children}</HomeCard>,
    '/scanner': <ScannerCard imgURL={imgURL} onClick={onClick} isSelected={isSelected} />,
    '/history': <HistoryCard title={title} content={content} imgURL={imgURL} onClick={onClick} />,
  };

  return componentsByPath[pathname] || (
    <RegularCard title={title} content={content} imgURL={imgURL} />
  );
}

export default Card;