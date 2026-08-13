type RatingStarsProps = {
    rating: number;
};

export function RatingStars({ rating }: RatingStarsProps) {
    return (
        <span aria-label={`Nota ${rating} de 5`} className="text-sm whitespace-nowrap">
            <span className="text-amber-400">{'★'.repeat(rating)}</span>
            <span className="text-slate-300">{'★'.repeat(5 - rating)}</span>
        </span>
    );
}