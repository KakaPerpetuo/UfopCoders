export default function TagChips({ tags, selectedTags, onToggleTag }) {
    return (
        <div className="flex flex-wrap gap-2 mb-6">
            {tags.map((tag) => {
                const active = selectedTags.includes(tag.id);

                return (
                    <button
                        key={tag.id}
                        type="button"
                        onClick={() => onToggleTag(tag.id)}
                        className={`
                            inline-flex items-center gap-1.5
                            px-3 py-1.5
                            rounded-full
                            text-sm font-medium
                            transition-all duration-200
                            cursor-pointer
                            ${active
                                ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
                                : 'bg-transparent border border-gray-700 text-gray-400 hover:border-violet-500 hover:text-white'
                            }
                        `}
                    >
                        {active && "✓"}
                        {tag.nome}
                    </button>
                );
            })}
        </div>
    );
}
