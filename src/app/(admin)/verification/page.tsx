'use client';

import React, { useState, useEffect, Fragment } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUsers, faLock, faWallet, faSignOutAlt, faInbox } from '@fortawesome/free-solid-svg-icons';
import { Dialog, Transition } from '@headlessui/react';
import axiosInstance from '@/shared/axiousintance';

type Performer = {
    id: string;
    bandName: string;
    createdAt: string;
    video: string;
    mobileNumber: string;
    description: string;
    isVerified: boolean;
    isRejected: boolean;
};

const Verification: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [sessionValid, setSessionValid] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [performers, setPerformers] = useState<Performer[]>([]);
  const [confirmationOpen, setConfirmationOpen] = useState<boolean>(false);
  const [selectedPerformer, setSelectedPerformer] = useState<Performer | null>(null);
  const [action, setAction] = useState<'approve' | 'reject' | null>(null);
  const [rejectReason, setRejectReason] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rejectReasonError, setRejectReasonError] = useState('');
  const itemsPerPage = 5;
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await axiosInstance.get('/admin/checkSession');
        if (response.data.isAuthenticated) {
          setSessionValid(true);
        } else {
          router.replace('/adminlogin');
        }
      } catch (error) {
        console.error('Session check failed:', error);
        router.replace('/adminlogin');
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [router]);

  useEffect(() => {
    if (sessionValid) {
      const fetchPerformers = async () => {
        try {
          const response = await axiosInstance.get('/admin/getTempPerformers');
          if (response.data && response.data.data) {
            const performersData = response.data.data.map((performer: any): Performer => ({
              id: performer._id,
              bandName: performer.bandName,
              createdAt: performer.createdAt,
              video: performer.video,
              mobileNumber: performer.mobileNumber,
              description: performer.description,
              isVerified: performer.isVerified || false,
              isRejected: performer.isRejected || false,
            }));
            setPerformers(performersData);
          }
        } catch (error) {
          console.error('Error fetching performers:', error);
        }
      };
      fetchPerformers();
    }
  }, [sessionValid]);

  const handleLogout = async () => {
    try {
      const response = await axiosInstance.post('/admin/adminLogout');
      if (response.data.success) {
        setTimeout(() => {
          router.replace('/adminlogin');
        }, 1000);
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const handleVerificationStatusChange = async (id: string, status: boolean) => {
    try {
      if (status) {
        await axiosInstance.post(`/admin/grant-performer-permission/${id}`, { 
          isVerified: true, 
          isRejected: false 
        });
      } else {
        await axiosInstance.post(`/admin/reject-performer-permission/${id}`, { 
          isVerified: false, 
          isRejected: true,
          rejectReason: rejectReason 
        });
      }
      
      setPerformers(prevPerformers =>
        prevPerformers.map(performer =>
          performer.id === id ? { ...performer, isVerified: status, isRejected: !status } : performer
        )
      );
      setConfirmationOpen(false);
      setRejectReason('');
    } catch (error) {
      console.error('Error updating performer status:', error);
    }
  };

  const openConfirmation = (performer: Performer, action: 'approve' | 'reject') => {
    setSelectedPerformer(performer);
    setAction(action);
    setRejectReason('');
    setConfirmationOpen(true);
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const totalPages = Math.ceil(performers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const selectedPerformers = performers.slice(startIndex, startIndex + itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const EmptyState: React.FC = () => (
    <div className="text-center py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
      <FontAwesomeIcon icon={faInbox} className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-2xl font-medium text-gray-900">No submissions available</h3>
      <p className="mt-1 text-sm text-gray-500">Get started by adding new performers to verify.</p>
    </div>
  );

  if (loading) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-75 flex justify-center items-center z-50">
        <div className="text-blue-600 text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-semibold">Loading...</h2>
        </div>
      </div>
    );
  }

  if (!sessionValid) return null;

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <aside className={`w-64 bg-gradient-to-b from-blue-600 to-blue-800 text-white p-6 h-screen fixed top-0 left-0 transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 z-30`}>
        <div className="flex items-center mb-8">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white mr-3">
            <img src="http://i.pravatar.cc/250?img=58" alt="Admin" className="w-full h-full object-cover" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Admin Name</h3>
            <span className="text-sm font-light">Administrator</span>
          </div>
        </div>

        <nav>
          <ul className="space-y-4">
            {[
              { icon: faHome, text: 'Dashboard', href: '/dashboard' },
              { icon: faUsers, text: 'User Management', href: '/usermanagement' },
              { icon: faUsers, text: 'Events', href: '/eventmanagement' },
              { icon: faLock, text: 'Verification', href: '/verification' },
              // { icon: faWallet, text: 'Wallet', href: '#wallet' }
            ].map((item, index) => (
              <li key={index}>
                <a href={item.href} className="flex items-center text-lg hover:bg-blue-700 p-3 rounded-lg transition-colors duration-200">
                  <FontAwesomeIcon icon={item.icon} className="mr-3" />
                  {item.text}
                </a>
              </li>
            ))}
            <li>
              <button onClick={handleLogout} className="w-full text-left flex items-center text-lg hover:bg-blue-700 p-3 rounded-lg transition-colors duration-200">
                <FontAwesomeIcon icon={faSignOutAlt} className="mr-3" />
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      <div className="flex-1 ml-0 md:ml-64 transition-all duration-300 ease-in-out">
        <div className="flex-1 p-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-center mb-8 text-indigo-700">Verification Submissions</h2>
            {performers.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-indigo-700 text-white">
                      <th className="p-4">Band Name</th>
                      <th className="p-4">Submit Date</th>
                      <th className="p-4">Video</th>
                      <th className="p-4">Mobile Number</th>
                      <th className="p-4">Description</th>
                      <th className="p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedPerformers.map((performer, index) => (
                      <tr key={performer.id} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-100 transition-colors duration-200`}>
                        <td className="p-4">{performer.bandName}</td>
                        <td className="p-4">{new Date(performer.createdAt).toLocaleDateString()}</td>
                        <td className="p-4">
                          <a href={performer.video} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 underline">View Video</a>
                        </td>
                        <td className="p-4">{performer.mobileNumber}</td>
                        <td className="p-4">{performer.description}</td>
                        <td className="p-4">
                          {performer.isVerified && (
                            <span className="text-green-500 font-semibold">Approved</span>
                          )}
                          {performer.isRejected && (
                            <span className="text-red-500 font-semibold">Rejected</span>
                          )}
                          {!performer.isVerified && !performer.isRejected && (
                            <>
                              <button
                                className="text-white bg-green-500 px-4 py-2 rounded hover:bg-green-600 mr-2 transition-colors duration-200"
                                onClick={() => openConfirmation(performer, 'approve')}
                              >
                                Approve
                              </button>
                              <button
                                className="text-white bg-red-500 px-4 py-2 rounded hover:bg-red-600 transition-colors duration-200"
                                onClick={() => openConfirmation(performer, 'reject')}
                              >
                                Reject
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {performers.length > 0 && (
              <div className="flex justify-between items-center mt-4">
                <button onClick={handlePrevPage} disabled={currentPage === 1} className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors duration-200">
                  Previous
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button onClick={handleNextPage} disabled={currentPage === totalPages} className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors duration-200">
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Transition appear show={confirmationOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setConfirmationOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30" />
          </Transition.Child>

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4"
              enterTo="opacity-100 translate-y-0"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-4"
            >
              <Dialog.Panel className="max-w-md w-full rounded-lg bg-white p-6">
                <Dialog.Title className="text-lg font-bold mb-4">
                  {action === 'approve' ? 'Approve Performer' : 'Reject Performer'}
                </Dialog.Title>
                {action === 'approve' ? (
                  <p>Are you sure you want to approve {selectedPerformer?.bandName}?</p>
                ) : (
                  <>
                    <p className="mb-4">Are you sure you want to reject {selectedPerformer?.bandName}?</p>
                    <label htmlFor="reject-reason" className="block text-sm font-medium text-gray-700">
                      Reason for Rejection
                    </label>
                    <textarea
                      id="reject-reason"
                      rows={4}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      placeholder="Please provide a reason for rejection..."
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                 
                    />
                    {rejectReasonError && <p className="text-red-500 text-sm">{rejectReasonError}</p>}
                  </>
                )}
                <div className="mt-6 flex justify-end">
                  <button 
                    className="mr-2 text-gray-500" 
                    onClick={() => setConfirmationOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
             className={`bg-${action === 'approve' ? 'green' : 'red'}-500 text-white px-4 py-2 rounded hover:bg-${action === 'approve' ? 'green' : 'red'}-600 transition-colors duration-200`}
             onClick={() => {
               if (action === 'reject' && !rejectReason.trim()) {
                
                setRejectReasonError('Please provide a reason for rejection');

            
                setTimeout(() => {
                  setRejectReasonError('');
                }, 1000);
                 return;
               }
               selectedPerformer && handleVerificationStatusChange(selectedPerformer.id, action === 'approve')
             }}
           >
             {action === 'approve' ? 'Approve' : 'Reject'}
           </button>
         </div>
       </Dialog.Panel>
     </Transition.Child>
   </div>
 </Dialog>
</Transition>
</div>
);
};

export default Verification;