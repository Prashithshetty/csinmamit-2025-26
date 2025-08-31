// import { useTheme } from '../../contexts/ThemeContext';

// const GlitchText = ({
//   children,
//   speed = 0.5,
//   enableShadows = true,
//   enableOnHover = false,
//   className = "",
// }) => {
//   const { isDark } = useTheme();
  
//   // Dynamic colors based on theme
//   const textColor = isDark ? 'text-white' : 'text-gray-900';
//   const bgColor = isDark ? 'dark:bg-gray-900' : 'bg-white';
//   const afterShadowColor = enableShadows 
//     ? (isDark ? '-5px 0 #ef4444' : '-5px 0 #dc2626') // red shades
//     : 'none';
//   const beforeShadowColor = enableShadows 
//     ? (isDark ? '5px 0 #06b6d4' : '5px 0 #0891b2') // cyan shades
//     : 'none';

//   const inlineStyles = {
//     "--after-duration": `${speed * 3}s`,
//     "--before-duration": `${speed * 2}s`,
//     "--after-shadow": afterShadowColor,
//     "--before-shadow": beforeShadowColor,
//   };

//   // Base classes with theme support
//   const baseClasses = `
//     ${textColor} 
//     text-[clamp(2rem,10vw,8rem)] 
//     font-black 
//     relative 
//     mx-auto 
//     select-none 
//     cursor-pointer
//     transition-colors
//     duration-300
//   `.trim();

//   // Pseudo element classes with theme-aware backgrounds
//   const pseudoClasses = !enableOnHover
//     ? `
//       after:content-[attr(data-text)] 
//       after:absolute 
//       after:top-0 
//       after:left-[10px] 
//       after:${isDark ? 'text-white' : 'text-gray-900'}
//       after:${isDark ? 'bg-gray-900' : 'bg-white'}
//       after:overflow-hidden 
//       after:[clip-path:inset(0_0_0_0)] 
//       after:[text-shadow:var(--after-shadow)] 
//       after:animate-glitch-after
//       after:transition-colors
//       after:duration-300
      
//       before:content-[attr(data-text)] 
//       before:absolute 
//       before:top-0 
//       before:left-[-10px] 
//       before:${isDark ? 'text-white' : 'text-gray-900'}
//       before:${isDark ? 'bg-gray-900' : 'bg-white'}
//       before:overflow-hidden 
//       before:[clip-path:inset(0_0_0_0)] 
//       before:[text-shadow:var(--before-shadow)] 
//       before:animate-glitch-before
//       before:transition-colors
//       before:duration-300
//     `.trim()
//     : `
//       after:content-[''] 
//       after:absolute 
//       after:top-0 
//       after:left-[10px] 
//       after:${isDark ? 'text-white' : 'text-gray-900'}
//       after:${isDark ? 'bg-gray-900' : 'bg-white'}
//       after:overflow-hidden 
//       after:[clip-path:inset(0_0_0_0)] 
//       after:opacity-0
//       after:transition-all
//       after:duration-300
      
//       before:content-[''] 
//       before:absolute 
//       before:top-0 
//       before:left-[-10px] 
//       before:${isDark ? 'text-white' : 'text-gray-900'}
//       before:${isDark ? 'bg-gray-900' : 'bg-white'}
//       before:overflow-hidden 
//       before:[clip-path:inset(0_0_0_0)] 
//       before:opacity-0
//       before:transition-all
//       before:duration-300
      
//       hover:after:content-[attr(data-text)] 
//       hover:after:opacity-100 
//       hover:after:[text-shadow:var(--after-shadow)] 
//       hover:after:animate-glitch-after
      
//       hover:before:content-[attr(data-text)] 
//       hover:before:opacity-100 
//       hover:before:[text-shadow:var(--before-shadow)] 
//       hover:before:animate-glitch-before
//     `.trim();

//   const combinedClasses = `${baseClasses} ${pseudoClasses} ${className}`;

//   return (
//     <div 
//       style={inlineStyles} 
//       data-text={children} 
//       className={combinedClasses}
//     >
//       {children}
//     </div>
//   );
// };

// export default GlitchText;
