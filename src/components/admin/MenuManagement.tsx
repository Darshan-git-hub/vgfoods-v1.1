import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import toast from 'react-hot-toast';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'veg' | 'non-veg';
  image_url: string;
}

const MenuManagement = () => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'veg',
    image_url: ''
  });

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('menu_items').select('*').order('name');
    if (error) {
      console.error('Error fetching menu items:', error);
      toast.error('Failed to fetch menu items.');
    } else {
      setItems(data || []);
    }
    setLoading(false);
  };

  const uploadImage = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `menu_images/${fileName}`;

    const { error } = await supabase.storage.from('menu_images').upload(filePath, file);
    if (error) {
      console.error('Image upload failed:', error);
      toast.error('Image upload failed.');
      return null;
    }
    return supabase.storage.from('menu_images').getPublicUrl(filePath).data.publicUrl;
  };

  const openModal = (item?: MenuItem) => {
    setEditingItem(item || null);
    setFormData(item
      ? { ...item, price: item.price.toString() }
      : { name: '', description: '', price: '', category: 'veg', image_url: '' }
    );
    setImageFile(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setImageFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = formData.image_url;

      if (imageFile) {
        const uploadedUrl = await uploadImage(imageFile);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        }
      }

      const menuItem = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        image_url: imageUrl,
      };

      if (editingItem) {
        const { error } = await supabase.from('menu_items').update(menuItem).eq('id', editingItem.id);
        if (error) throw error;
        toast.success('Menu item updated successfully');
      } else {
        const { error } = await supabase.from('menu_items').insert([menuItem]);
        if (error) throw error;
        toast.success('Menu item added successfully');
      }

      setIsModalOpen(false);
      fetchMenuItems();
    } catch (error) {
      console.error('Error saving menu item:', error);
      toast.error(editingItem ? 'Failed to update menu item' : 'Failed to add menu item');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      const { error } = await supabase.from('menu_items').delete().eq('id', id);
      if (error) throw error;
      toast.success('Menu item deleted successfully');
      setItems((prevItems) => prevItems.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Error deleting menu item:', error);
      toast.error('Failed to delete menu item');
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Menu Management</h2>
        <button
          onClick={() => openModal()}
          className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 w-full sm:w-auto"
        >
          <Plus className="w-5 h-5" />
          <span>Add Item</span>
        </button>
      </div>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {items.map(item => (
            <div key={item.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col">
              <img src={item.image_url} alt={item.name} className="w-full h-48 object-cover" />
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div className="flex items-center gap-2 mb-2">
                  {item.category === 'veg' ? (
                    <img src="https://freesvg.org/img/1531813273.png" alt="Veg" className="w-5 h-5 sm:w-6 sm:h-6" />
                  ) : (
                    <img src="https://freesvg.org/img/1531813245.png" alt="Non-Veg" className="w-5 h-5 sm:w-6 sm:h-6" />
                  )}
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{item.name}</h3>
                </div>
                <div className="flex space-x-2 mt-4 justify-end">
                  <button onClick={() => openModal(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-full">
                    <Pencil className="w-5 h-5" />
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-full">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget && window.innerWidth >= 640) {
              closeModal();
            }
          }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{editingItem ? 'Edit' : 'Add'} Menu Item</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                required 
                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600" 
                placeholder="Item Name" 
              />
              <textarea 
                name="description" 
                value={formData.description} 
                onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                required 
                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600" 
                placeholder="Description"
                rows={3}
              />
              <input 
                type="number" 
                name="price" 
                value={formData.price} 
                onChange={(e) => setFormData({ ...formData, price: e.target.value })} 
                required 
                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600" 
                placeholder="Price" 
              />
              <select 
                name="category" 
                value={formData.category} 
                onChange={(e) => setFormData({ ...formData, category: e.target.value as 'veg' | 'non-veg' })} 
                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
              >
                <option value="veg">Veg</option>
                <option value="non-veg">Non-Veg</option>
              </select>
              <input 
                type="file" 
                onChange={(e) => setImageFile(e.target.files?.[0] || null)} 
                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600" 
              />
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  type="submit" 
                  className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : editingItem ? 'Update' : 'Add'} Item
                </button>
                <button 
                  type="button" 
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuManagement;