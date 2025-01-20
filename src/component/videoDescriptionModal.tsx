import React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X } from 'lucide-react';

interface Performer {
  id: string;
  bandName: string;
  createdAt: string;
  video: string;
  mobileNumber: string;
  description: string;
  isVerified: boolean;
  isRejected: boolean;
}

interface VideoDescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  performer: Performer | null;
}

const VideoDescriptionModal: React.FC<VideoDescriptionModalProps> = ({
  isOpen,
  onClose,
  performer
}) => {
  return (
    <Transition show={isOpen} as={React.Fragment}>
      <Dialog 
        as="div" 
        className="relative z-50" 
        onClose={onClose}
      >
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                <div className="flex justify-between items-center mb-4">
                  <Dialog.Title className="text-2xl font-bold text-gray-900">
                    {performer?.bandName}
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="rounded-full p-1 hover:bg-gray-100 transition-colors"
                    type="button"
                    aria-label="Close modal"
                  >
                    <X className="h-6 w-6 text-gray-500" />
                  </button>
                </div>

                <div className="h-96"> {/* Increased fixed height */}
                  {performer && (
                    <iframe
                      src={performer.video}
                      className="w-full h-full rounded-lg"
                      allowFullScreen
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      title={`${performer.bandName} video`}
                    />
                  )}
                </div>

                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2 text-gray-900">Description</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{performer?.description}</p>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default VideoDescriptionModal;