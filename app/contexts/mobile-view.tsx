import { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from "react";

interface MobileViewContextType {
    isMobileView: boolean;
    setIsMobileView: Dispatch<SetStateAction<boolean>>;
}

const MobileViewContext = createContext<MobileViewContextType | undefined>(undefined);

export const MobileViewProvider: React.FC<{ children: React.ReactNode }>= ({ children }) => {
    const [isMobileView, setIsMobileView] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 1024) {
                setIsMobileView(false);
            }
        };
        console.log(isMobileView);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    })

    return (
        <MobileViewContext.Provider value={{ isMobileView, setIsMobileView }}>
            {children}
        </MobileViewContext.Provider>
    );
};

export const useMobileView = () => {
    const context = useContext(MobileViewContext);
    if (!context) {
        throw new Error("useMobileView must be used within a MobileViewProvider");
    }
    return context;
};