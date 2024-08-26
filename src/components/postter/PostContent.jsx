import React from 'react';
import { Link } from 'react-router-dom';

const PostContent = ({ content }) => {

  if(content === null || content === "" || content === undefined){
    return
  }

  // 正規表現で<uid>...</uid>を検出してリンクに置換
  const renderContentWithLinks = (text) => {
    const regex = /<uid>(.*?)<\/uid>/g;
    const parts = text.split(regex);
    
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        // <uid>...</uid>部分をリンクに置換
        return <Link key={index} to={`/postter/${part}/`}>{`@${part}`}</Link>;
      }
      return part;
    });
  };

  return <>{renderContentWithLinks(content)}</>;
};

export default PostContent;