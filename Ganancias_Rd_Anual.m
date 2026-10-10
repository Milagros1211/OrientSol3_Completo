function [GanaR_Anu_0, PorGanaR_Anu_0] = Ganancias_Rd_Anual(Radiacion_Rd_Optima)

%GANANCIAS RESPECTO AL PLANO HORIZONTAL::::::::::::::::::::::::::::::::::::
%COCIENTE__________________________________________________________________
    %En "GanaD_Anu_0" se almacenan las ganancias de radiación de la
    %inclinación óptima respecto al plano horizontal. 
    %Ganancia InclOptAnu = Rdm (Opt Anual) / Rdm (0)
    
    GanaR_Anu_0 = zeros(1,12);
    
    for i=1:12
    
        GanaR_Anu_0(i)= Radiacion_Rd_Optima(i) / 0;

    end
%PORCENTAJE________________________________________________________________     
    %En "PorGanaD_Anu_0" se almacenan las pérdidas calculadas en
    %porcentaje. 
    %Siendo Gananancia InclOptAnu (%) = ((Rdm (Opt Anual) / Rdm (0))-1)*100
    
    PorGanaR_Anu_0 = zeros(1,12); 
    
    for j=1:12
   
        PorGanaR_Anu_0(j)= (GanaR_Anu_0(j)-1)*100;
    
    end



end

