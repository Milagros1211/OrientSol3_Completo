function [GanaB_Anu_0, PorGanaB_Anu_0] = Ganancias_Bd_Anual(Val_Bdm0, Radiacion_Bd_Optima)

%GANANCIAS RESPECTO AL PLANO HORIZONTAL::::::::::::::::::::::::::::::::::::
%COCIENTE__________________________________________________________________
    %En "GanaB_Anu_0" se almacenan las ganancias de radiación de la
    %inclinación óptima respecto al plano horizontal. 
    %Ganancia InclOptAnu = Bdm (Opt Anual) / Bdm (0)
    
    GanaB_Anu_0 = zeros(1,12);
    
    for i=1:12
    
        GanaB_Anu_0(i)= Radiacion_Bd_Optima(i) / Val_Bdm0(i);

    end
%PORCENTAJE________________________________________________________________     
    %En "PorGanaB_Anu_0" se almacenan las pérdidas calculadas en
    %porcentaje. 
    %Siendo Gananancia InclOptAnu (%) = ((Bdm (Opt Anual) / Bdm (0))-1)*100
    
    PorGanaB_Anu_0 = zeros(1,12); 
    
    for j=1:12
   
        PorGanaB_Anu_0(j)= (GanaB_Anu_0(j)-1)*100;
    
    end


end

