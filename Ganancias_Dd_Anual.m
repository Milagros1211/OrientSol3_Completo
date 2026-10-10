function [GanaD_Anu_0, PorGanaD_Anu_0] = Ganancias_Dd_Anual(Val_Ddm0, Radiacion_Dd_Optima)

%GANANCIAS RESPECTO AL PLANO HORIZONTAL::::::::::::::::::::::::::::::::::::
%COCIENTE__________________________________________________________________
    %En "GanaD_Anu_0" se almacenan las ganancias de radiación de la
    %inclinación óptima respecto al plano horizontal. 
    %Ganancia InclOptAnu = Ddm (Opt Anual) / Ddm (0)
    
    GanaD_Anu_0 = zeros(1,12);
    
    for i=1:12
    
        GanaD_Anu_0(i)= Radiacion_Dd_Optima(i) / Val_Ddm0(i);

    end
%PORCENTAJE________________________________________________________________     
    %En "PorGanaD_Anu_0" se almacenan las pérdidas calculadas en
    %porcentaje. 
    %Siendo Gananancia InclOptAnu (%) = ((Ddm (Opt Anual) / Ddm (0))-1)*100
    
    PorGanaD_Anu_0 = zeros(1,12); 
    
    for j=1:12
   
        PorGanaD_Anu_0(j)= (GanaD_Anu_0(j)-1)*100;
    
    end
end

