import ustpLogo from '@/assets/ustp-logo.png';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-white p-1">
                <img src={ustpLogo} alt="USTP Logo" className="size-full object-contain" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">
                    USTP Balubal ICT Portal
                </span>
                <span className="truncate text-xs text-muted-foreground">
                    Balubal Campus
                </span>
            </div>
        </>
    );
}
