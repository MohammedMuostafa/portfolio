import {
    ArrowDown,
    ArrowDownRight,
    ArrowUpRight,
    CircleCheck,
    Copy,
    createIcons,
    GraduationCap,
    Languages,
    Menu,
    MessagesSquare,
    ServerCog,
    Sparkles,
    UserRound,
    UsersRound,
    Wrench,
    X,
} from 'lucide';

const icons = {
    ArrowDown,
    ArrowDownRight,
    ArrowUpRight,
    CircleCheck,
    Copy,
    GraduationCap,
    Languages,
    Menu,
    MessagesSquare,
    ServerCog,
    Sparkles,
    UserRound,
    UsersRound,
    Wrench,
    X,
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
