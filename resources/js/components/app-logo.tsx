import ustpLogo from '@/assets/ustp-logo.png';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-full bg-white shadow-md p-1">
                <img src={ustpLogo} alt="USTP Logo" className="size-full object-contain" />
            </div>
            <div className="ml-2 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate font-serif leading-tight font-bold text-white">
                    USTP Balubal ICT Portal
                </span>
                <span className="truncate text-[10px] uppercase tracking-widest text-ustp-gold">
                    Balubal Campus
                </span>
            </div>
        </>
    );
}
