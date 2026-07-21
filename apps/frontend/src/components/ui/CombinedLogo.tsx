interface CombinedLogoProps{
    admin?: boolean;
}

export default function CombinedLogo({admin}: CombinedLogoProps){
    return(
        <div className="flex gap-x-2 items-center">
            <img src="/LibrexLogo.svg" alt="librexLogo" className="max-w-[30px]" />
            <h4 className="text-[18px] font-semibold text-navy">Librex {admin? <span className="font-[Lora]!">| Admin</span> : ''}</h4>
        </div>
    )
}