export default function Heading({
    title,
    description,
    variant = 'default',
}: {
    title: string;
    description?: string;
    variant?: 'default' | 'small';
}) {
    return (
        <header className={variant === 'small' ? '' : 'mb-8 space-y-0.5'}>
            <h2
                className={
                    variant === 'small'
                        ? 'mb-0.5 text-base font-medium text-gray-200'
                        : 'text-xl font-semibold tracking-tight text-gray-50'
                }
            >
                {title}
            </h2>
            {description && (
                <p className="text-sm text-gray-400">{description}</p>
            )}
        </header>
    );
}
