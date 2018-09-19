import React from 'react';
import { Link } from 'react-router-dom';

const TagList = ({tags}) => {
  return (
    <div>
      {tags.map(tag =>
        <Link key={tag} to={`/tags/react/${tag}`}>
          <code key={tag}>{tag}</code>
        </Link>
      )}
    </div>
  );
}

export default TagList;
