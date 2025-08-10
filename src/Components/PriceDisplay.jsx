const PriceDisplay = ({ price, className }) => (
  <p className={className} >
    {price.toFixed(2)}
  </p>
);

export default PriceDisplay;