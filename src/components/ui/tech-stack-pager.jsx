import {
  FaReact,
  FaNodeJs,
  FaAndroid,
  FaPython,
  FaJava,
  FaDocker,
} from "react-icons/fa";
import {
  SiTypescript,
  SiJavascript,
  SiTailwindcss,
  SiFirebase,
  SiSupabase,
  SiMysql,
  SiFlutter,
  SiTensorflow,
  SiArduino,
  SiKotlin,
  SiRedux,
  SiVite,
} from "react-icons/si";

const technologies = [
  { label: "React.js", icon: FaReact },
  { label: "Node.js", icon: FaNodeJs },
  { label: "TypeScript", icon: SiTypescript },
  { label: "JavaScript", icon: SiJavascript },
  { label: "Tailwind CSS", icon: SiTailwindcss },
  { label: "Firebase", icon: SiFirebase },
  { label: "Supabase", icon: SiSupabase },
  { label: "MySQL", icon: SiMysql },
  { label: "Flutter", icon: SiFlutter },
  { label: "Android", icon: FaAndroid },
  { label: "TensorFlow", icon: SiTensorflow },
  { label: "Arduino", icon: SiArduino },
  { label: "Python", icon: FaPython },
  { label: "Java", icon: FaJava },
  { label: "Kotlin", icon: SiKotlin },
  { label: "Docker", icon: FaDocker },
  { label: "Redux Toolkit", icon: SiRedux },
  { label: "Vite", icon: SiVite },
];

function TechnologyItems({ duplicate = false }) {
  return technologies.map(({ label, icon: Icon }) => (
    <div
      className="tech-library-card"
      key={duplicate ? `${label}-duplicate` : label}
      aria-hidden={duplicate ? "true" : undefined}
    >
      <Icon />
      <span>{label}</span>
    </div>
  ));
}

export default function TechStackPager() {
  return (
    <div className="tech-library-marquee">
      <div className="tech-library-head">
        <span>TECH LIBRARY</span>
      </div>

      <div className="tech-library-window">
        <div className="tech-library-track">
          <div className="tech-library-group">
            <TechnologyItems />
          </div>

          <div className="tech-library-group" aria-hidden="true">
            <TechnologyItems duplicate />
          </div>
        </div>
      </div>
    </div>
  );
}
