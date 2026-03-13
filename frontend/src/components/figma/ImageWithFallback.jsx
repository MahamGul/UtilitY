export function ImageWithFallback({ src, alt, className }) {
  const handleError = (e) => {
    e.target.src = "https://via.placeholder.com/150";
  };

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={handleError}
    />
  );
}