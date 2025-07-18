import React, { useState } from 'react';
import axios from 'axios';

const ProdcutsCreated = () => {
    const [formData, setFormData] = useState({
    products_name: '',
    image_url: [{ url: '', color: '' }],
    pricing: [{ quantity: '', price_per: '', discount: 0 }],
    Stock: '',
    Desciptions: ['']
  });

  

    // Handle simple field change
  const handleChange = (e, field) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  // Handle nested field change (image_url, pricing)
  const handleNestedChange = (e, field, index, subField) => {
    const updated = [...formData[field]];
    updated[index][subField] = e.target.value;
    setFormData({ ...formData, [field]: updated });
  };

  // Handle description change
  const handleDescriptionChange = (e, index) => {
    const updated = [...formData.Desciptions];
    updated[index] = e.target.value;
    setFormData({ ...formData, Desciptions: updated });
  };

  // Add new image/color block
  const addImageField = () => {
    setFormData({ ...formData, image_url: [...formData.image_url, { url: '', color: '' }] });
  };

  // Add new pricing block
  const addPricingField = () => {
    setFormData({
      ...formData,
      pricing: [...formData.pricing, { quantity: '', price_per: '', discount: 0 }]
    });
  };

  // Add new description field
  const addDescriptionField = () => {
    setFormData({ ...formData, Desciptions: [...formData.Desciptions, ''] });
  };

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
     const res =  await axios.post('http://localhost:3000/products/create', formData);
      console.log(res)
      alert(res?.message)

      // Optionally reset form
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };
  return (
     <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-6">Create Product</h2>
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Product Name */}
        <input
          type="text"
          placeholder="Product Name"
          className="w-full border p-2 rounded"
          value={formData.products_name}
          onChange={(e) => handleChange(e, 'products_name')}
          required
        />

        {/* Images and Colors */}
        <div>
          <h3 className="font-medium text-lg mb-2">Product Images & Colors</h3>
          {formData.image_url.map((img, i) => (
            <div key={i} className="flex gap-3 mb-3">
              <input
                type="text"
                placeholder="Image URL"
                className="flex-1 border p-2 rounded"
                value={img.url}
                onChange={(e) => handleNestedChange(e, 'image_url', i, 'url')}
                required
              />
              <input
                type="text"
                placeholder="Color"
                className="w-40 border p-2 rounded"
                value={img.color}
                onChange={(e) => handleNestedChange(e, 'image_url', i, 'color')}
                required
              />
            </div>
          ))}
          <button
            type="button"
            onClick={addImageField}
            className="text-blue-600 font-medium hover:underline"
          >
            + Add another image
          </button>
        </div>

        {/* Pricing Section */}
        <div>
          <h3 className="font-medium text-lg mb-2">Pricing</h3>
          {formData.pricing.map((item, i) => (
            <div key={i} className="grid grid-cols-3 gap-4 mb-3">
              <input
                type="number"
                placeholder="Quantity"
                className="border p-2 rounded"
                value={item.quantity}
                onChange={(e) => handleNestedChange(e, 'pricing', i, 'quantity')}
                required
              />
              <input
                type="number"
                placeholder="Price Per Unit"
                className="border p-2 rounded"
                value={item.price_per}
                onChange={(e) => handleNestedChange(e, 'pricing', i, 'price_per')}
                required
              />
              <input
                type="number"
                placeholder="Discount (%)"
                className="border p-2 rounded"
                value={item.discount}
                onChange={(e) => handleNestedChange(e, 'pricing', i, 'discount')}
              />
            </div>
          ))}
          <button
            type="button"
            onClick={addPricingField}
            className="text-blue-600 font-medium hover:underline"
          >
            + Add another price option
          </button>
        </div>

        {/* Stock */}
        <input
          type="number"
          placeholder="Stock"
          className="w-full border p-2 rounded"
          value={formData.Stock}
          onChange={(e) => handleChange(e, 'Stock')}
          required
        />

        {/* Descriptions */}
        <div>
          <h3 className="font-medium text-lg mb-2">Descriptions</h3>
          {formData.Desciptions.map((desc, i) => (
            <textarea
              key={i}
              placeholder={`Description ${i + 1}`}
              className="w-full border p-2 rounded mb-2"
              value={desc}
              onChange={(e) => handleDescriptionChange(e, i)}
              required
            />
          ))}
          <button
            type="button"
            onClick={addDescriptionField}
            className="text-blue-600 font-medium hover:underline"
          >
            + Add another description
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Create Product
        </button>
      </form>
    </div>
  )
}

export default ProdcutsCreated