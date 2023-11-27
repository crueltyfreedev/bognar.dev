import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import Tag from './tag';
import TagMap from './project-tag-map';

type FilterProps = {
    tags: string[],
    className?: string,
    selectedTags: string[],
    setSelectedTags: Dispatch<SetStateAction<string[]>>;
};




const ProjectFilter = ({ tags, className, selectedTags, setSelectedTags }: FilterProps) => {

    const handleTagClick = (tag: string) => {
        console.log(selectedTags);
        if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter(selectedTag => selectedTag !== tag));

        } else {
            setSelectedTags([...selectedTags, tag]);
            tags.sort((a, b) => {
                const aSelected = selectedTags.includes(a);
                const bSelected = selectedTags.includes(b);

                if (aSelected && !bSelected) {
                    return -1;
                } else if (!aSelected && bSelected) {
                    return 1;
                } else {
                    return 0;
                }
            });
        }
    };

    return (
        <TagMap tags={tags} handleTagClick={handleTagClick} selectedTags={selectedTags} />
    );
};

export default ProjectFilter;