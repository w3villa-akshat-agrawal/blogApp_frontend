import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Toast from '../components/Toast';
import { adminPannel, block, unBlock } from '../api/adminApi';
import Button from '../components/Button';

const AdminPage = () => {
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [users, setUsers] = useState([]);
  const [isAdmin, setIsAdmin] = useState(true);
  const [count, setcount] = useState(0)
  // Pagination
  const [page, setPage] = useState(1); // starts from 1
  const [limit] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  // Search
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const showToast = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 4000);
  };
  const handelBlock = async (id) => {
  try {
    await block(id);
    showToast('User blocked successfully', 'success');

    // // Optional: refresh user list after blocking
    // const result = await adminPannel(debouncedSearch, page, limit);
    // const { users, pagination } = result.data.data;
    // setUsers(users);
    // setTotalCount(pagination.count);
    setcount(prev=>prev+1)
  } catch (error) {
    showToast(error.message, 'error');
    console.error(error);
  }
};
  const handelunBlock = async (id) => {
  try {
    
    await unBlock(id);
    showToast('User unblocked successfully', 'success');

    // // Optional: refresh user list after blocking
    // const result = await adminPannel(debouncedSearch, page, limit);
    // const { users, pagination } = result.data.data;
    // setUsers(users);
    // setTotalCount(pagination.count);
    setcount(prev=>prev+1)
  } catch (error) {
    showToast(error.message, 'error');
    console.error(error);
  }
};
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1); // reset to page 1 when searching
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    const getAdmin = async () => {
      try {
        const result = await adminPannel(debouncedSearch, page, limit);
        const { currentAdmin, users, pagination } = result.data.data;

        if (!currentAdmin) {
          setIsAdmin(false);
          showToast('You are not authorized to access this page', 'error');
          return;
        }

        setUsers(users);
        setTotalCount(pagination.count);
      } catch (error) {
        setIsAdmin(false);
        showToast('You are not authorized or something went wrong', 'error');
        console.log(error);
      }
    };
    getAdmin();
  }, [debouncedSearch, page,count]);

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <>
      <Navbar />
      <Toast
        visible={toastVisible}
        message={toastMessage}
        type={toastType}
        onClose={() => setToastVisible(false)}
      />

      <div className="container min-h-screen mx-auto px-4 py-6 text-black">
        <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>

        {isAdmin && (
          <>
            {/* Search Bar */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search by username or phone"
                className="w-full max-w-sm p-2 border border-gray-300 rounded"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 border">ID</th>
                    <th className="py-2 px-4 border">Username</th>
                    <th className="py-2 px-4 border">Phone</th>
                    <th className="py-2 px-4 border">Active</th>
                    <th className="py-2 px-4 border">Plan</th>
                    <th className="py-2 px-4 border">Activated At</th>
                    <th className="py-2 px-4 border">Expires At</th>
                     <th className="py-2 px-4 border">access</th>
                    
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="text-center">
                      <td className="py-2 px-4 border">{user.id}</td>
                      <td className="py-2 px-4 border">{user.username}</td>
                      <td className="py-2 px-4 border">{user.phone || 'N/A'}</td>
                      <td className="py-2 px-4 border">
                        {user.isActive === null
                          ? '-'
                          : user.isActive
                          ? 'Yes'
                          : 'No'}
                      </td>
                      <td className="py-2 px-4 border">{user.subscription?.name || 'N/A'}</td>
                      <td className="py-2 px-4 border">
                        {user.subscription?.name === 'Free'
                          ? '-'
                          : user.planActivatedAt || '-'}
                      </td>
                      <td className="py-2 px-4 border">
                        {user.subscription?.name === 'Free'
                          ? '-'
                          : user.planExpiresAt || '-'}
                      </td>
                   <td className="py-2 px-4 border">
                        {user.isActive ? (<button onClick={()=>handelBlock(user.id)} className='bg-red-500 rounded px-3 text-white'>BLOCK</button>):(<button onClick={()=>handelunBlock(user.id)} className='bg-green-500 rounded px-3 text-white'>unblock</button>)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-4">
              <button
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
              >
                Previous
              </button>
              <span className="text-sm">
                Page {page} of {totalPages}
              </span>
              <button
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={page >= totalPages}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default AdminPage;
