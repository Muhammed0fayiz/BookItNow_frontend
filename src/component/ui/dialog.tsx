import React from "react";

interface DialogTriggerProps {
    asChild?: boolean;
    children: React.ReactNode;
  }
  
  export const DialogTrigger: React.FC<DialogTriggerProps> = ({ asChild, children }) => {
    const child = React.Children.only(children);
  
    const triggerProps = {
      onClick: () => {
        const dialogRoot = document.querySelector(`[data-dialog-root]`);
        if (dialogRoot) {
          dialogRoot.classList.add('dialog-open');
        }
      },
    };
  
    if (asChild && React.isValidElement(child)) {
      return React.cloneElement(child, triggerProps);
    }
  
    return (
      <button className="btn-primary" {...triggerProps}>
        {children}
      </button>
    );
  };
  