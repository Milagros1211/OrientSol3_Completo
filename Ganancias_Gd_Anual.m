function [GanaG_Anu_0, PorGanaG_Anu_0] = Ganancias_Gd_Anual(DATOS, Radiacion_optima)

%GANANCIAS RESPECTO AL PLANO HORIZONTAL::::::::::::::::::::::::::::::::::::
%COCIENTE__________________________________________________________________
    %En "GanaG_Anu_0" se almacenan las ganancias de radiación de la
    %inclinación óptima respecto al plano horizontal. 
    %Ganancia InclOptAnu = Gdm (Opt Anual) / Gdm (0)
    
    GanaG_Anu_0 = zeros(1,12);
    
    for i=1:12
    
        GanaG_Anu_0(i)= Radiacion_optima(i) / DATOS(i+2);

    end
%PORCENTAJE________________________________________________________________     
    %En "PorGanaG_Anu_0" se almacenan las pérdidas calculadas en
    %porcentaje. 
    %Siendo Gananancia InclOptAnu (%) = ((Gdm (Opt Anual) / Gdm (0))-1)*100
    
    PorGanaG_Anu_0 = zeros(1,12); 
    
    for j=1:12
   
        PorGanaG_Anu_0(j)= (GanaG_Anu_0(j)-1)*100;
    
    end


end

