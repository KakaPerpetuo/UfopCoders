import { useEffect, useState } from "react"; 

export default function ProjectTags(props) {
    
    const [selectedTags, setSelectedTags] = useState([]);
    
    function selectTag(tag) {
        let newArray;

        if(selectedTags.includes(tag.nome)) {
            newArray = selectedTags.filter((newTag) => newTag !== tag.nome);
            setSelectedTags(newArray);
        }
        else {
            newArray = [...selectedTags, tag.nome];
        }

        setSelectedTags(newArray);

        if (props.onTagsChange) {
            props.onTagsChange(newArray); 
        }

    };

    return (
        <div className="flex gap-2 flex-wrap">
            { props.tags.map((tag) => (
                <div 
                    className={"hover:border-violet-500 hover:-translate-y-1 transition-transform font-bold px-4 py-2 cursor-pointer flex items-center justify-center rounded-lg border border-border" + (selectedTags.includes(tag.nome) ?" bg-violet-500" : "")}
                    onClick={() => selectTag(tag)}
                >
                    {tag.nome}
                </div>
            ))}
        </div>
    );
}