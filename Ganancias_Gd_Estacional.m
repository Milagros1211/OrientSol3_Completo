function [GanaG_Est_0, GanaG_Est_Anu, PorGanaG_Est_0, PorGanaG_Est_Anu] = Ganancias_Gd_Estacional(DATOS, GdOpt_Inv, GdOpt_Pri, GdOpt_Ver, GdOpt_Oto, Radiacion_optima)

%Ya que están en variables independientes las GdOpt de cada estación, se
%almacenan en RadiacionG_optima_Est todos. Pero OJO con diciembre

RadiacionG_optima_Est = zeros(1,12);

RadiacionG_optima_Est(12)= GdOpt_Inv(1); %Diciembre
RadiacionG_optima_Est(1)= GdOpt_Inv(2); %Enero
RadiacionG_optima_Est(2)= GdOpt_Inv(3); %Febero

RadiacionG_optima_Est(3)= GdOpt_Pri(1); %Marzo
RadiacionG_optima_Est(4)= GdOpt_Pri(2); %Abril
RadiacionG_optima_Est(5)= GdOpt_Pri(3); %Mayo

RadiacionG_optima_Est(6)= GdOpt_Ver(1); %Junio
RadiacionG_optima_Est(7)= GdOpt_Ver(2); %Julio
RadiacionG_optima_Est(8)= GdOpt_Ver(3); %Agosto

RadiacionG_optima_Est(9)= GdOpt_Oto(1); %Septiembre
RadiacionG_optima_Est(10)= GdOpt_Oto(2); %Octubre
RadiacionG_optima_Est(11)= GdOpt_Oto(3); %Noviembre

%GANANCIAS RESPECTO AL PLANO HORIZONTAL::::::::::::::::::::::::::::::::::::
%COCIENTE__________________________________________________________________
    %En "GanaG_Est_0" se almacenan las ganancias de radiación de la
    %inclinación óptima respecto al plano horizontal. 
    %Ganancia InclOptEst_0 = Gdm (Opt Estacional) / Gdm (0)
    
    GanaG_Est_0 = zeros(1,12);
    
    for i=1:12
    
        GanaG_Est_0(i)= RadiacionG_optima_Est(i) / DATOS(i+2);

    end
%PORCENTAJE________________________________________________________________     
    %En "PorGanaG_Est_0" se almacenan las pérdidas calculadas en
    %porcentaje. 
    %Siendo Gananancia InclOptEst_0 (%) = ((Gdm (Opt Estacional) / Gdm (0))-1)*100
    
    PorGanaG_Est_0 = zeros(1,12); 
    
    for j=1:12
   
        PorGanaG_Est_0(j)= (GanaG_Est_0(j)-1)*100;
    
    end

%GANANCIAS RESPECTO A LA INCLINACIÓN ÓPTIMA ANUAL::::::::::::::::::::::::::
%COCIENTE__________________________________________________________________
    %En "GanaG_Est_Anu" se almacenan las ganancias de radiación de la
    %inclinación óptima respecto a la inclinación óptima anual
    %Ganancia InclOptEst_Anu = Gdm (Opt Estacional) / Gdm (Opt Anual)
    
    GanaG_Est_Anu = zeros(1,12);
    
    for i=1:12
    
        GanaG_Est_Anu(i)= RadiacionG_optima_Est(i) / Radiacion_optima (i);

    end
%PORCENTAJE________________________________________________________________     
    %En "PorGanaG_Est_Anu" se almacenan las pérdidas calculadas en
    %porcentaje. 
    %Siendo Gananancia InclOptEst_Anu (%) = ((Gdm (Opt Estacional) / Gdm (Opt Anual))-1)*100
    
    PorGanaG_Est_Anu = zeros(1,12); 
    
    for j=1:12
   
        PorGanaG_Est_Anu(j)= (GanaG_Est_Anu(j)-1)*100;
    
    end

end

