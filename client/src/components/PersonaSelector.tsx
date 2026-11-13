import { ChatStore, type Persona } from '../store/chatStore';

const personas: Persona[] = [
  {
    id: 'hitesh',
    name: 'Hitesh Chaudhary',
    role: 'Founder, Chai aur Code',
    image: '/hitesh.jpg',
  },
  {
    id: 'piyush',
    name: 'Piyush Garg',
    role: 'Founder, Teachyst',
    image: '/piyush.jpg',
  },
];

const PersonaSelector = () => {
  const {selectedPersona, setSelectedPersona} = ChatStore()
  const activeId = selectedPersona?.id;

  const handleSelect = (persona: Persona) => {
    setSelectedPersona(persona)
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-xl">
        {personas.map((persona) => {
          const isSelected = activeId === persona.id;

          return (
            <div
              key={persona.id}
              onClick={() => handleSelect(persona)}
              className={`group cursor-pointer rounded-2xl bg-[#141414] border transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col ${
                isSelected
                  ? 'border-[#f97316]'
                  : 'border-[#262626] hover:border-[#f97316]/60'
              }`}
            >
              <div className="relative aspect-square w-full overflow-hidden bg-[#141414]">
                <img
                  src={persona.image}
                  alt={persona.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 select-none block"
                />
                <div className="absolute inset-x-0 -bottom-2 top-0 bg-gradient-to-t from-[#141414] via-[#141414]/30 to-transparent pointer-events-none" />
              </div>

              <div className="p-5 text-center flex flex-col justify-center flex-1 relative z-10 bg-[#141414] -mt-2">
                <h3 className="text-lg font-bold text-white transition-colors duration-200 group-hover:text-[#f97316]">
                  {persona.name}
                </h3>
                <p className="text-sm text-neutral-400 mt-1">
                  {persona.role}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PersonaSelector;
