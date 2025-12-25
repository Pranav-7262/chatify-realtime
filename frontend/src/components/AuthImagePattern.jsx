const AuthImagePattern = ({ title, subtitle }) => {
  return (
    <div className="hidden lg:flex items-center justify-center bg-base-200/50 p-12">
      <div className="max-w-md text-center">
        {/* Animated Grid */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className={`
                aspect-square rounded-3xl transition-all duration-500
                ${
                  i % 2 === 0
                    ? "bg-primary animate-pulse shadow-lg shadow-primary/20"
                    : "bg-primary/20 hover:bg-primary/30 scale-95"
                }
              `}
            />
          ))}
        </div>

        {/* Text Content */}
        <div className="space-y-2">
          <h2 className="text-3xl font-extrabold tracking-tight text-base-content">
            {title}
          </h2>
          <p className="text-lg text-base-content/70 leading-relaxed">
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthImagePattern;
