#!/usr/bin/env node
/**
 * Add the "Motion Graphics" domain into the existing "Creative & Interactive"
 * cluster. Idempotent upsert. Cross-links related Creative domains.
 *   node scripts/add-motion-graphics-domain.mjs
 */
import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const kbPath = join(__dirname, '..', 'src/content/knowledge-base.json')
const kb = JSON.parse(await readFile(kbPath, 'utf8'))

const CLUSTER = 'Creative & Interactive'

const motionGraphics = {
  slug: 'motion-graphics',
  name: 'Motion Graphics',
  cluster: CLUSTER,
  icon: '🌀',
  tagline: 'Make graphics move, animated logos, titles, and explainers that grab attention in the first second.',
  introVideo: {
    url: 'https://www.youtube.com/watch?v=BhiH0RHFBwQ',
    videoId: 'BhiH0RHFBwQ',
    title: 'Complete Beginners Guide to Motion Graphics in 2025!',
    channel: 'Asquareportal',
  },
  overview:
    'Motion graphics is graphic design that moves. Instead of a still poster or logo, you make text, shapes, icons, and illustrations animate: a logo that builds itself, words that slide and pop in time with music, an explainer video where simple shapes act out an idea. It is the animated layer you see everywhere, in YouTube intros, app onboarding screens, Instagram ads, sports broadcasts, and the lower-third name tags on interviews.\n\nIt sits right between graphic design and animation. You borrow design rules (layout, color, typography, hierarchy) and add the rules of movement (timing, easing, anticipation) so things feel alive instead of robotic. The magic word is "easing": real objects speed up and slow down, they never move at a constant robotic pace, and learning to make your animations ease is what turns "amateur" into "smooth and professional." Most motion graphics is 2D, but the field stretches into 3D, character animation, and visual effects as you grow.\n\nThe main tool is Adobe After Effects, the industry standard, and there is a genuinely free, powerful alternative in DaVinci Resolve\'s Fusion page plus free options like Blender for 3D motion. You do not need to draw well or be a "real animator." You need a sense of timing, patience for fiddly keyframes, and the willingness to copy tutorials until the core moves become muscle memory. A beginner can make a clean animated logo or a 15-second kinetic-text piece in their first few weeks.',
  whyItMatters:
    'Attention is the whole game online, and movement wins attention. A motion graphic stops the scroll, explains an idea faster than text, and makes a brand look polished and modern. Every company that posts video, which is now basically every company, needs intros, lower-thirds, animated ads, and explainers. That makes motion designers some of the best-paid creatives, and it is freelance-friendly: a single animated logo or explainer is a clear, sellable deliverable. It also pairs with almost everything, video editing, UI/UX, social media, and 3D, so the skill keeps opening doors.',
  isItForYou:
    'This is for you if you like design but find still images a little boring, and the idea of making something move sounds fun rather than scary. It rewards patience and an eye for timing, you will nudge a keyframe a few frames and replay a clip many times until it "feels" right. You do not need to be a great illustrator; plenty of motion designers animate simple shapes and type. If you enjoyed the design or video editing domains and want the next creative step, motion graphics is a natural fit. It is less ideal if you want instant results, since polish here comes from many small adjustments.',
  prerequisites: [
    'A computer that can run After Effects or DaVinci Resolve, motion software is heavier than basic design apps, so a few GB of RAM and some patience help',
    'Basic design sense: a feel for layout, color, and especially typography, since lots of motion work is animated text',
    'Comfort with files and being organized, projects have many layers and assets that get messy fast',
    'No drawing or animation background needed; you can animate simple shapes and text to start',
    'Patience for detail and repetition, you will replay the same two seconds many times to get the timing right',
  ],
  coreConcepts: [
    { name: 'Keyframes', what: 'Markers that record a value at a moment in time, like position or opacity. Set one with text off-screen and another with it on-screen, and the software fills in the movement between them. Keyframes are the foundation of everything in motion.' },
    { name: 'Easing (ease in / ease out)', what: 'How an animation speeds up and slows down instead of moving at a robotic constant rate. Real things accelerate and decelerate. Adding easing is the single biggest upgrade from "beginner" to "smooth and professional."' },
    { name: 'The graph editor', what: 'A view that shows your animation as curves you can bend. Steeper curve means faster motion, flatter means slower. It is how pros fine-tune easing and get that satisfying, weighty feel.' },
    { name: 'Composition (comp)', what: 'Your canvas and timeline in After Effects, where layers live and animate. You can nest one comp inside another to build complex scenes from simple pieces.' },
    { name: 'Layers', what: 'Every element, text, a shape, an image, a video, sits on its own layer, stacked in the timeline. Higher layers appear in front. You animate each layer\'s properties over time.' },
    { name: 'Anchor point', what: 'The pivot an object scales and rotates around. Put the anchor in the wrong spot and a rotation swings wildly; centering it (or placing it deliberately) is a small thing that fixes a lot of beginner frustration.' },
    { name: 'Parenting', what: 'Linking one layer to another so the child follows the parent. Move or rotate the parent and the children come along, the trick behind animating arms, gears, or grouped elements together.' },
    { name: 'Masks and mattes', what: 'Ways to hide or reveal parts of a layer using a shape. A "track matte" lets one layer act as a window for another, how text gets filled with video or a logo wipes on.' },
    { name: 'The 12 principles of animation', what: 'Classic rules (squash and stretch, anticipation, follow-through, timing, and more) from Disney that make motion feel believable. They apply to bouncing logos just as much as cartoon characters.' },
    { name: 'Expressions', what: 'Tiny snippets of code (JavaScript) that drive animation automatically, like wiggle() to add natural jitter, or linking a value to a slider. They save huge amounts of manual keyframing once you are comfortable.' },
    { name: 'Kinetic typography', what: 'Animated text that moves in time with a voiceover or music. A staple of lyric videos, ads, and social posts, and a great beginner project because the "art" is mostly timing.' },
    { name: 'Rendering and codecs', what: 'Turning your timeline into a finished video file. After Effects often renders to a high-quality intermediate, then you compress to H.264 MP4 for upload. Knowing this avoids huge files or blurry exports.' },
  ],
  toolsAndTech: [
    'Adobe After Effects - the industry-standard motion graphics tool; paid subscription, but every tutorial and job assumes it',
    'DaVinci Resolve (Fusion page) - free, node-based motion graphics and VFX built into the free editor; the best no-cost way to learn',
    'Blender - free, open-source 3D suite great for 3D motion graphics and animation',
    'Cavalry / Rive - newer motion tools (Rive is great for animated UI/app graphics)',
    'Adobe Illustrator / Photoshop - design the artwork that you then animate in After Effects',
    'Figma - design UI and simple animations; common handoff source for motion work',
    'Cinema 4D - popular paid 3D app tightly integrated with After Effects (Lite version ships with some Adobe plans)',
    'LottieFiles - export lightweight animations (JSON) for websites and apps',
    'Canva - basic, beginner-friendly animation for quick social graphics',
    'Mixkit / Pexels / Envato - free and paid stock footage, music, and motion templates',
  ],
  roadmap: [
    {
      stage: 'Beginner (Weeks 0-6): Make simple things move',
      goal: 'Learn the interface and animate basic shapes and text with smooth easing.',
      steps: [
        'Pick your tool: After Effects (free trial) or DaVinci Resolve Fusion (free forever) and learn the layout: composition, timeline, layers',
        'Animate the four basic properties of a layer: position, scale, rotation, opacity, using keyframes',
        'Learn easing: apply Easy Ease and open the graph editor to make motion speed up and slow down',
        'Animate simple text: make words fade, slide, and pop in time with a beat',
        'Follow 3-4 short beginner tutorials start to finish, copying exactly before you improvise',
      ],
      milestoneProject: 'Animate a clean 5-second logo reveal or a 15-second kinetic-text quote, with smooth easing and a music track.',
    },
    {
      stage: 'Building (Months 1-3): Animate with intention',
      goal: 'Make movement feel believable using animation principles, and build short complete pieces.',
      steps: [
        'Study the 12 principles of animation and apply anticipation, follow-through, and good timing to your moves',
        'Learn shape layers, masks, and track mattes to build and reveal graphics',
        'Use parenting and anchor points to rig and animate grouped elements',
        'Add your first expressions (like wiggle()) to automate natural motion',
        'Design artwork in Illustrator/Figma, then bring it into After Effects to animate',
      ],
      milestoneProject: 'Make a 20-30 second animated explainer or product promo: animated icons/shapes, kinetic text, a voiceover or music, and a clean ending card.',
    },
    {
      stage: 'Intermediate (Months 3-6): Polish and workflow',
      goal: 'Produce smooth, professional-looking pieces and work faster like a real motion designer.',
      steps: [
        'Master the graph editor to get weighty, satisfying easing every time',
        'Learn character or icon animation basics: rigging simple characters with parenting or tools like Duik',
        'Add simple 3D: layers in 3D space, cameras, and basic lighting for depth',
        'Speed up with expressions, presets, and a tidy, well-named project structure',
        'Learn proper rendering: render queue, intermediate codecs, and H.264 export for the web',
      ],
      milestoneProject: 'Create a 30-60 second branded explainer with a consistent style, animated characters or icons, sound design, and a polished render, good enough for a portfolio.',
    },
    {
      stage: 'Advanced (Months 6+): Specialize and go pro',
      goal: 'Develop a style, handle real client work, and optionally move into 3D or VFX.',
      steps: [
        'Pick a lane: explainer animation, broadcast/branding, UI motion, or 3D motion graphics',
        'Go deeper in 3D with Cinema 4D or Blender for lighting, materials, and camera work',
        'Learn motion design for apps/web with Rive or Lottie so animations ship in real products',
        'Build a reel: 60-90 seconds of your best 5-second moments, cut to music',
        'Practice client workflow: briefs, style frames, revisions, and delivering in multiple formats',
      ],
      milestoneProject: 'Produce a polished 60-90 second demo reel and one full client-style project (brief to final delivery), exported for both horizontal and vertical platforms.',
    },
  ],
  freeCourses: [
    { title: 'School of Motion - Free tutorials & resources', url: 'https://www.schoolofmotion.com/blog', provider: 'School of Motion', level: 'Beginner to Advanced', note: 'Free. The most respected motion design school publishes a huge library of free tutorials, guides, and their famous animation-principles content. Free (paid bootcamps optional).' },
    { title: 'Complete Intro to Motion Design (full After Effects course)', url: 'https://www.youtube.com/watch?v=ROw_Xnmg2W4', provider: 'TipTut (YouTube)', level: 'Beginner', note: 'Free. A full, beginner-friendly After Effects course in one video, from zero to making real motion graphics.' },
    { title: 'After Effects Tutorials', url: 'https://helpx.adobe.com/after-effects/tutorials.html', provider: 'Adobe', level: 'Beginner to Intermediate', note: 'Free. Adobe\'s own step-by-step lessons for the industry-standard tool, free to watch even on the trial.' },
    { title: 'DaVinci Resolve (Fusion) Official Training', url: 'https://www.blackmagicdesign.com/products/davinciresolve/training', provider: 'Blackmagic Design', level: 'Beginner to Advanced', note: 'Free. Official training books and project files covering Fusion, the free, node-based motion graphics + VFX page in DaVinci Resolve.' },
    { title: 'Motion Design Basics - Beginner\'s Guide', url: 'https://www.svgator.com/blog/motion-design-basics-guide/', provider: 'SVGator', level: 'Beginner', note: 'Free. A clear written intro to the core ideas of motion design before you open any software.' },
    { title: 'Free Motion Graphics Resources & Tutorials', url: 'https://blog.nobledesktop.com/learn/motion-graphics/motion-graphics-free-resources-and-tutorials', provider: 'Noble Desktop', level: 'Beginner', note: 'Free. A curated roundup of free places to learn motion graphics, handy for finding your next lesson.' },
  ],
  youtubeChannels: [
    { name: 'School of Motion', url: 'https://www.youtube.com/@SchoolofMotion', whyGood: 'The gold standard for learning motion design. Clear, high-quality tutorials and the best explanations of animation principles and easing.' },
    { name: 'Ben Marriott', url: 'https://www.youtube.com/@benmarriott', whyGood: 'Friendly, modern After Effects tutorials with a strong design sense. Great weekly lessons for beginners and improvers.' },
    { name: 'TipTut', url: 'https://www.youtube.com/@TipTut', whyGood: 'Practical, no-fluff After Effects tutorials including a full free intro course. Easy to follow along with.' },
    { name: 'ECAbrams', url: 'https://www.youtube.com/@ECAbrams', whyGood: 'Deep, patient explanations of how After Effects actually works, perfect when you want to understand, not just copy.' },
    { name: 'Motion Design School (Mt. Mograph)', url: 'https://www.youtube.com/@MtMograph', whyGood: 'Slick technique breakdowns and effects that make your work look pro. Inspiring once you know the basics.' },
    { name: 'Jake In Motion', url: 'https://www.youtube.com/@JakeInMotion', whyGood: 'Approachable tutorials and honest advice on learning motion design and freelancing as a beginner.' },
  ],
  articlesAndDocs: [
    { title: 'School of Motion Blog', url: 'https://www.schoolofmotion.com/blog', provider: 'School of Motion', level: 'Beginner to Advanced', note: 'Free. In-depth articles on technique, career, software, and the principles behind great motion design.' },
    { title: 'After Effects User Guide', url: 'https://helpx.adobe.com/after-effects/user-guide.html', provider: 'Adobe', level: 'Beginner to Advanced', note: 'Free. The official reference for every panel, tool, and effect in After Effects.' },
    { title: 'Motion Design School (free articles)', url: 'https://motiondesign.school/', provider: 'Motion Design School', level: 'Beginner to Intermediate', note: 'Free and paid. Tutorials and courses focused on stylish, modern motion design.' },
    { title: 'Greyscalegorilla - tutorials & assets', url: 'https://greyscalegorilla.com/', provider: 'Greyscalegorilla', level: 'Intermediate', note: 'Free and paid. A go-to source for 3D motion graphics tutorials and materials (especially Cinema 4D).' },
    { title: 'Best Motion Graphics Video Tutorials', url: 'https://blog.nobledesktop.com/learn/motion-graphics/motion-graphics-video-tutorials', provider: 'Noble Desktop', level: 'Beginner', note: 'Free. A guided list of strong video tutorials to start with, sorted for beginners.' },
  ],
  interactivePractice: [
    { name: 'DaVinci Resolve (free, with Fusion)', url: 'https://www.blackmagicdesign.com/products/davinciresolve', note: 'Free. A real motion graphics + VFX tool (Fusion page) at no cost, no time limit. The best place to practice without a subscription.' },
    { name: 'Blender (free)', url: 'https://www.blender.org/', note: 'Free, open-source 3D software for practicing 3D motion graphics and animation.' },
    { name: 'LottieFiles', url: 'https://lottiefiles.com/', note: 'Free library of animations you can study, plus tools to export your own for web and apps. Great for seeing how others build motion.' },
    { name: 'Behance - Motion Graphics', url: 'https://www.behance.net/search/projects?field=motion%20graphics', note: 'Free. Endless real motion projects to study for inspiration and to see the current bar for quality.' },
    { name: 'Mixkit (free motion templates)', url: 'https://mixkit.co/', note: 'Free video clips, music, and After Effects/Premiere templates to practice editing and reverse-engineer.' },
  ],
  communities: [
    { name: 'r/MotionDesign', url: 'https://www.reddit.com/r/MotionDesign/', note: 'The main subreddit for motion designers: critiques, career talk, and "how did they do that?" threads.' },
    { name: 'r/AfterEffects', url: 'https://www.reddit.com/r/AfterEffects/', note: 'Active community for After Effects help, troubleshooting, and technique sharing.' },
    { name: 'School of Motion Community', url: 'https://www.schoolofmotion.com/', note: 'A large, welcoming community of motion designers connected to the school\'s free and paid programs.' },
    { name: 'Behance', url: 'https://www.behance.net/', note: 'Where motion designers post portfolios. Follow pros, study projects, and eventually showcase your own reel.' },
  ],
  projectIdeas: [
    { title: 'Animated logo reveal', what: 'Take a logo and make it build, fade, or pop on screen in 5 seconds with smooth easing. The classic first project.', difficulty: 'Beginner' },
    { title: 'Kinetic typography quote', what: 'Animate a short quote or song lyric so the words move in time with a beat or voiceover.', difficulty: 'Beginner' },
    { title: 'Lower-thirds & title pack', what: 'Build a set of animated name tags and titles you could reuse for any video or YouTube channel.', difficulty: 'Beginner' },
    { title: 'Shape-animation loop', what: 'Make a satisfying seamless loop of morphing, bouncing shapes, great for learning easing and the graph editor.', difficulty: 'Intermediate' },
    { title: '30-second explainer video', what: 'Animate simple icons and text to explain an app or idea, with a voiceover, music, and an end card.', difficulty: 'Intermediate' },
    { title: 'Animated social ad (vertical)', what: 'Create a punchy 9:16 product or event ad with kinetic text and motion, exported for Reels/TikTok.', difficulty: 'Intermediate' },
    { title: '3D motion graphic', what: 'Use Blender or Cinema 4D to animate a 3D logo or abstract scene with camera movement and lighting.', difficulty: 'Advanced' },
    { title: 'Demo reel', what: 'Cut your best 5-second moments into a 60-90 second reel set to music, your single most important portfolio piece.', difficulty: 'Advanced' },
  ],
  careerPaths: [
    'Motion Graphics Designer (ads, social content, branding, explainers)',
    'Broadcast / brand motion designer (TV graphics, channel branding, title sequences)',
    'Explainer & UI motion designer (product explainers, app/web animation with Lottie/Rive)',
    '3D motion artist (Cinema 4D / Blender for 3D logos, products, and abstract visuals)',
    'Video editor + motion designer hybrid (a very employable combo for YouTube and agencies)',
    'Freelance motion designer (logos, intros, and explainers sold as clear deliverables)',
  ],
  timeToJobReady:
    'Roughly 4-8 months of steady practice to start taking simple paid work (animated logos, lower-thirds, short social pieces), and around 12 months to build a reel strong enough for junior motion designer roles. A solid demo reel matters far more than any certificate.',
  commonMistakes: [
    'No easing. Linear, constant-speed motion is the number-one beginner giveaway. Add ease in/out to almost everything.',
    'Ignoring the graph editor. The default eases only get you so far; real polish lives in bending those curves.',
    'Animating before designing. Weak layout, color, or typography cannot be saved by movement. Make it look good still, then animate.',
    'Too much motion at once. Everything flying and spinning is chaos. Move what matters and let the rest be calm.',
    'Wrong anchor points, so rotations and scales swing from the wrong pivot. Set anchors deliberately.',
    'Overusing templates without understanding them, you learn nothing and the work looks generic. Rebuild templates to learn.',
    'Messy projects: hundreds of unnamed layers and comps. Name and organize as you go or future-you will suffer.',
    'Render mistakes: exporting giant files or blurry, wrong-codec video. Learn the render queue and H.264 for the web.',
  ],
  glossary: [
    { term: 'Keyframe', definition: 'A recorded value at a point in time; the software animates the change between two keyframes.' },
    { term: 'Easing', definition: 'Making motion speed up and slow down instead of moving at a constant rate, so it feels natural.' },
    { term: 'Graph editor', definition: 'A view of your animation as adjustable curves, used to fine-tune speed and easing.' },
    { term: 'Composition', definition: 'The canvas and timeline in After Effects where layers are arranged and animated.' },
    { term: 'Layer', definition: 'A single element (text, shape, image, video) on the timeline; higher layers sit in front.' },
    { term: 'Anchor point', definition: 'The pivot an object scales and rotates around.' },
    { term: 'Parenting', definition: 'Linking one layer to another so the child follows the parent\'s movement.' },
    { term: 'Mask', definition: 'A shape that hides or reveals part of a layer.' },
    { term: 'Track matte', definition: 'Using one layer as a window to reveal another, e.g. text filled with video.' },
    { term: 'Expression', definition: 'A small piece of code that drives an animated value automatically (like wiggle()).' },
    { term: 'Kinetic typography', definition: 'Animated text that moves in time with audio or music.' },
    { term: 'Pre-comp', definition: 'A composition nested inside another, used to group and reuse animated elements.' },
    { term: 'Render', definition: 'Turning your timeline into a finished video file.' },
    { term: 'Lottie', definition: 'A lightweight animation format (JSON) for playing motion graphics on websites and in apps.' },
  ],
  relatedDomains: ['design', 'video-editing', '3d-modeling', 'game-development'],
  verificationNotes: [
    'Intro video verified via YouTube oEmbed and is current: "Complete Beginners Guide to Motion Graphics in 2025!" by Asquareportal (videoId BhiH0RHFBwQ), embeddable and from 2025.',
    'All YouTube channels verified reachable (HTTP 200): @SchoolofMotion, @benmarriott, @TipTut, @ECAbrams, @MtMograph, @JakeInMotion.',
    'Resource links checked and live: School of Motion, Adobe After Effects tutorials/user guide, Blackmagic DaVinci Resolve (Fusion) training, SVGator guide, Noble Desktop roundups, Motion Design School, Greyscalegorilla, Blender, Behance. Canva/LottieFiles/Reddit return 403 to bots but are real, stable pages.',
    'Distinct from the Design and Video Editing domains: motion graphics is specifically about animating design elements (After Effects / Fusion), and is cross-linked to both.',
    'Tooling reflects 2024-2026 reality: After Effects as the standard, with free DaVinci Resolve Fusion and Blender as no-cost paths, plus Lottie/Rive for shipping motion in real products.',
  ],
}

if (!kb.clusters.includes(CLUSTER)) kb.clusters.push(CLUSTER)
const slugs = new Set(kb.domains.map((d) => d.slug))
motionGraphics.relatedDomains = motionGraphics.relatedDomains.filter((s) => slugs.has(s))

const i = kb.domains.findIndex((d) => d.slug === motionGraphics.slug)
if (i >= 0) kb.domains[i] = motionGraphics
else {
  let lastIdx = -1
  kb.domains.forEach((x, idx) => { if (x.cluster === CLUSTER) lastIdx = idx })
  kb.domains.splice(lastIdx + 1, 0, motionGraphics)
}

// cross-link siblings to motion-graphics
for (const s of ['design', 'video-editing']) {
  const d = kb.domains.find((x) => x.slug === s)
  if (d && Array.isArray(d.relatedDomains) && !d.relatedDomains.includes('motion-graphics')) d.relatedDomains.push('motion-graphics')
}

await writeFile(kbPath, JSON.stringify(kb, null, 2))
console.log('total domains:', kb.domains.length)
console.log('Creative & Interactive:', kb.domains.filter((d) => d.cluster === CLUSTER).map((d) => d.slug).join(', '))
