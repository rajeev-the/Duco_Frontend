const PriceDisplay = ({ price, className }) => (
  <p className={className} >
    €{price.toFixed(2).replace('.', ',')}
  </p>
);

export default PriceDisplay;