import {
    ArrowDown,
    ArrowDownRight,
    ArrowUpRight,
    AtSign,
    CircleCheck,
    Code2,
    Copy,
    createIcons,
    Globe2,
    GraduationCap,
    Languages,
    Link2,
    Menu,
    MessageCircle,
    MessagesSquare,
    Play,
    Send,
    ServerCog,
    Sparkles,
    UserRound,
    UsersRound,
    Video,
    Wrench,
} from 'lucide';

const icons = {
    ArrowDown,
    ArrowDownRight,
    ArrowUpRight,
    AtSign,
    CircleCheck,
    Code2,
    Copy,
    Globe2,
    GraduationCap,
    Languages,
    Link2,
    Menu,
    MessageCircle,
    MessagesSquare,
    Play,
    Send,
    ServerCog,
    Sparkles,
    UserRound,
    UsersRound,
    Video,
    Wrench,
};

window.portfolioIcons = {
    create() {
        createIcons({
            icons,
            attrs: {
                'aria-hidden': 'true',
                'stroke-width': 1.8,
            },
        });
    },
};
