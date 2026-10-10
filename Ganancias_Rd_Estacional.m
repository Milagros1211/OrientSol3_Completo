function [GanaR_Est_0, GanaR_Est_Anu, PorGanaR_Est_0, PorGanaR_Est_Anu] = Ganancias_Rd_Estacional(RdOpt_Inv, RdOpt_Pri, RdOpt_Ver, RdOpt_Oto, Radiacion_Rd_Optima)

%Ya que están en variables independientes las RdOpt de cada estación, se
%almacenan en RadiacionR_optima_Est todos. Pero OJO con diciembre.

RadiacionR_optima_Est = zeros(1,12);

RadiacionR_optima_Est(12)= RdOpt_Inv(1); %Diciembre
RadiacionR_optima_Est(1)= RdOpt_Inv(2); %Enero
RadiacionR_optima_Est(2)= RdOpt_Inv(3); %Febero

RadiacionR_optima_Est(3)= RdOpt_Pri(1); %Marzo
RadiacionR_optima_Est(4)= RdOpt_Pri(2); %Abril
RadiacionR_optima_Est(5)= RdOpt_Pri(3); %Mayo

RadiacionR_optima_Est(6)= RdOpt_Ver(1); %Junio
RadiacionR_optima_Est(7)= RdOpt_Ver(2); %Julio
RadiacionR_optima_Est(8)= RdOpt_Ver(3); %Agosto

RadiacionR_optima_Est(9)= RdOpt_Oto(1); %Septiembre
RadiacionR_optima_Est(10)= RdOpt_Oto(2); %Octubre
RadiacionR_optima_Est(11)= RdOpt_Oto(3); %Noviembre

%GANANCIAS RESPECTO AL PLANO HORIZONTAL::::::::::::::::::::::::::::::::::::
%COCIENTE__________________________________________________________________
    %En "GanaR_Est_0" se almacenan las ganancias de radiación de la
    %inclinación óptima respecto al plano horizontal. 
    %Ganancia InclOptEst_0 = Rdm (Opt Estacional) / Rdm (0) = infinito
    
    GanaR_Est_0 = zeros(1,12);
    
    for i=1:12
    
        GanaR_Est_0(i)= RadiacionR_optima_Est(i) / 0;

    end
%PORCENTAJE________________________________________________________________     
    %En "PorGanaR_Est_0" se almacenan las pérdidas calculadas en
    %porcentaje. 
    %Siendo Gananancia InclOptEst_0 (%) = ((Rdm (Opt Estacional) / Rdm (0))-1)*100
    
    PorGanaR_Est_0 = zeros(1,12); 
    
    for j=1:12
   
        PorGanaR_Est_0(j)= (GanaR_Est_0(j)-1)*100;
    
    end

%GANANCIAS RESPECTO A LA INCLINACIÓN ÓPTIMA ANUAL::::::::::::::::::::::::::
%COCIENTE__________________________________________________________________
    %En "GanaR_Est_Anu" se almacenan las ganancias de radiación de la
    %inclinación óptima respecto a la inclinación óptima anual
    %Ganancia InclOptEst_Anu = Rdm (Opt Estacional) / Rdm (Opt Anual)
    
    GanaR_Est_Anu = zeros(1,12);
    
    for i=1:12
    
        GanaR_Est_Anu(i)= RadiacionR_optima_Est(i) / Radiacion_Rd_Optima (i);

    end
%PORCENTAJE________________________________________________________________     
    %En "PorGanaR_Est_Anu" se almacenan las pérdidas calculadas en
    %porcentaje. 
    %Siendo Gananancia InclOptEst_Anu (%) = ((Rdm (Opt Estacional) / Rdm (Opt Anual))-1)*100
    
    PorGanaR_Est_Anu = zeros(1,12); 
    
    for j=1:12
   
        PorGanaR_Est_Anu(j)= (GanaR_Est_Anu(j)-1)*100;
    
    end



end

