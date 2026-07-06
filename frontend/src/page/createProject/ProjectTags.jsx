 
export default function ProjectTags(props) {
    
    const selectedTags = [];
    
    function selectTag(tag) {
        tag.selected = !(tag.selected);
        
        if(selectedTags.includes(tag.title)) {
            selectedTags.pop(tag.title);
        }
        else {
            selectedTags.push(tag.title);
        }
    };

    return (
        <div className="flex gap-2">
            { props.tags.map((tag) => (
                <div 
                    className="font-bold px-4 py-2 cursor-pointer flex items-center justify-center rounded-lg border border-border"
                    onClick={() => selectTag(tag)}
                >
                    {tag.title}
                </div>
            ))}
        </div>
    );
}