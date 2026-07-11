export default function CreateProjectForm({ onCancel }) {
    // Lista estática apenas para simular visualmente (como você pediu sem funcionalidade)
    const mockTags = [
        "AI", "Python", "Machine Learning", "Backend", "Blockchain", "Solidity", 
        "Web3", "React", "Web", "TypeScript", "WebSockets", "Mobile", 
        "React Native", "Firebase", "Quantum", "Algorithms", "Education", "Security"
    ];

    return (
        <div className="w-full max-w-3xl mx-auto bg-card border border-border rounded-[var(--radius)] p-8 flex flex-col gap-6 shadow-lg">
            <h2 className="text-2xl font-bold text-foreground mb-2">Create New Project</h2>

            {/* Project Title */}
            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-foreground">Project Title</label>
                <input 
                    type="text" 
                    placeholder="Enter your project title" 
                    className="w-full bg-background border border-border text-foreground placeholder-muted-foreground text-sm rounded-[var(--radius)] px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-foreground">Description</label>
                <textarea 
                    placeholder="Describe your project, its goals, and what you're looking to build" 
                    rows="4"
                    className="w-full bg-background border border-border text-foreground placeholder-muted-foreground text-sm rounded-[var(--radius)] px-4 py-3 focus:outline-none focus:border-primary transition-colors resize-none"
                />
            </div>

            {/* Technologies & Topics */}
            <div className="flex flex-col gap-2">
                <div>
                    <label className="text-sm font-medium text-foreground">Technologies & Topics</label>
                    <p className="text-xs text-muted-foreground mt-1">Select the tags that best describe your project</p>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                    {mockTags.map(tag => (
                        <button 
                            key={tag}
                            type="button"
                            className="text-sm px-4 py-1.5 rounded-full bg-accent text-accent-foreground hover:bg-primary/20 hover:text-primary transition-colors border border-transparent hover:border-primary/50"
                        >
                            {tag}
                        </button>
                    ))}
                </div>
            </div>

            {/* Maximum Team Members */}
            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-foreground">Maximum Team Members</label>
                <input 
                    type="number" 
                    placeholder="5" 
                    defaultValue="5"
                    className="w-full bg-background border border-border text-foreground placeholder-muted-foreground text-sm rounded-[var(--radius)] px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 mt-4">
                <button 
                    type="button" 
                    className="flex-1 bg-primary text-primary-foreground font-medium py-3 rounded-[var(--radius)] hover:bg-primary/90 transition-colors"
                >
                    Create Project
                </button>
                <button 
                    type="button" 
                    onClick={onCancel}
                    className="px-6 py-3 bg-transparent border border-border text-foreground rounded-[var(--radius)] hover:bg-accent transition-colors font-medium"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}
