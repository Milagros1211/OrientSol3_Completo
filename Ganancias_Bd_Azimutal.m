function [GanaB_Azi_0, GanaB_Azi_Anu, GanaB_Azi_Est, GanaB_Azi_Pol, GanaB_Azi_Hor, PorGanaB_Azi_0, PorGanaB_Azi_Anu, PorGanaB_Azi_Est, PorGanaB_Azi_Pol, PorGanaB_Azi_Hor] = Ganancias_Bd_Azimutal(Val_Bdm0, Radiacion_Bd_Optima, BdOpt_Inv, BdOpt_Pri, BdOpt_Ver, BdOpt_Oto, BdEjePolar, BdEjeAzimutal, BdEjeHorizontal)

%GANANCIAS RESPECTO AL PLANO HORIZONTAL::::::::::::::::::::::::::::::::::::
%COCIENTE__________________________________________________________________
    %En "GanaB_Azi_0" se almacenan las ganancias de radiación para un
    %seguimiento a un eje azimutal respecto al plano horizontal. 
    %Ganancia EjeAzimutal_0 = Bdm (Seg. Eje Azimutal) / Bdm (0)
    
    GanaB_Azi_0 = zeros(1,12);
    
    for i=1:12
    
        GanaB_Azi_0(i)= BdEjeAzimutal(i) / Val_Bdm0(i);

    end
%PORCENTAJE________________________________________________________________     
    %En "PorGanaB_Azi_0" se almacenan las pérdidas calculadas en
    %porcentaje. 
    %Siendo Gananancia EjeAzimutal_0 (%) = ((Bdm (Seg. Eje Azimutal) / Bdm (0))-1)*100
    
    PorGanaB_Azi_0 = zeros(1,12); 
    
    for j=1:12
   
        PorGanaB_Azi_0(j)= (GanaB_Azi_0(j)-1)*100;
    
    end

%GANANCIAS RESPECTO A LA INCLINACIÓN ÓPTIMA ANUAL::::::::::::::::::::::::::
%COCIENTE__________________________________________________________________
    %En "GanaB_Azi_Anu" se almacenan las ganancias de radiación para un
    %seguimiento a un eje azimutal respecto a la inclinación óptima anual. 
    %Ganancia EjeAzimutal_Anu = Bdm (Seg. Eje Azimutal) / Bdm (Inc Opt Anual)
    
    GanaB_Azi_Anu = zeros(1,12);
    
    for i=1:12
    
        GanaB_Azi_Anu(i)= BdEjeAzimutal(i) / Radiacion_Bd_Optima(i);

    end
%PORCENTAJE________________________________________________________________     
    %En "PorGanaB_Azi_Anu" se almacenan las pérdidas calculadas en
    %porcentaje. 
    %Siendo Gananancia EjeAzimutal_Anu (%) = ((Bdm (Seg. Eje Azimutal) / Bdm (Inc Opt Anual))-1)*100
    
    PorGanaB_Azi_Anu = zeros(1,12); 
    
    for j=1:12
   
        PorGanaB_Azi_Anu(j)= (GanaB_Azi_Anu(j)-1)*100;
    
    end

%GANANCIAS RESPECTO A LA INCLINACIÓN ÓPTIMA ESTACIONAL:::::::::::::::::::::
%Ya que están en variables independientes las BdOpt de cada estación, se
%almacenan en RadiacionG_optima_Est todos. Pero OJO con diciembre

RadiacionB_optima_Est = zeros(1,12);

RadiacionB_optima_Est(12)= BdOpt_Inv(1); %Diciembre
RadiacionB_optima_Est(1)= BdOpt_Inv(2); %Enero
RadiacionB_optima_Est(2)= BdOpt_Inv(3); %Febero

RadiacionB_optima_Est(3)= BdOpt_Pri(1); %Marzo
RadiacionB_optima_Est(4)= BdOpt_Pri(2); %Abril
RadiacionB_optima_Est(5)= BdOpt_Pri(3); %Mayo

RadiacionB_optima_Est(6)= BdOpt_Ver(1); %Junio
RadiacionB_optima_Est(7)= BdOpt_Ver(2); %Julio
RadiacionB_optima_Est(8)= BdOpt_Ver(3); %Agosto

RadiacionB_optima_Est(9)= BdOpt_Oto(1); %Septiembre
RadiacionB_optima_Est(10)= BdOpt_Oto(2); %Octubre
RadiacionB_optima_Est(11)= BdOpt_Oto(3); %Noviembre

%COCIENTE__________________________________________________________________
    %En "GanaB_Azi_Est" se almacenan las ganancias de radiación para un
    %seguimiento a un eje azimutal respecto a la inclinación óptima estacional. 
    %Ganancia EjeAzimutal_Est = Bdm (Seg. Eje Azimutal) / Bdm (Inc Opt Estacional)
    
    GanaB_Azi_Est = zeros(1,12);
    
    for i=1:12
    
        GanaB_Azi_Est(i)= BdEjeAzimutal(i) / RadiacionB_optima_Est(i);

    end
%PORCENTAJE________________________________________________________________     
    %En "PorGanaB_Azi_Est" se almacenan las pérdidas calculadas en
    %porcentaje. 
    %Siendo Gananancia EjeAzimutal_Est (%) = ((Bdm (Seg. Eje Azimutal) / Bdm (Inc Opt Estacional))-1)*100
    
    PorGanaB_Azi_Est = zeros(1,12); 
    
    for j=1:12
   
        PorGanaB_Azi_Est(j)= (GanaB_Azi_Est(j)-1)*100;
    
    end    
        
    
%GANANCIAS RESPECTO A UN SEGUIMIENTO A UN EJE POLAR::::::::::::::::::::::::
%COCIENTE__________________________________________________________________
    %En "GanaB_Azi_Pol" se almacenan las ganancias de radiación para un
    %seguimiento a un eje azimutal respecto a un seguimiento a un eje polar
    %Ganancia EjeAzimutal_Pol = Bdm (Seg. Eje Azimutal) / Bdm (Seg. Eje Polar)
    
    GanaB_Azi_Pol = zeros(1,12);
    
    for i=1:12
    
        GanaB_Azi_Pol(i)= BdEjeAzimutal(i) / BdEjePolar(i);

    end
%PORCENTAJE________________________________________________________________     
    %En "PorGanaB_Azi_Pol" se almacenan las pérdidas calculadas en
    %porcentaje. 
    %Siendo Gananancia EjeAzimutal_Pol (%) = ((Bdm (Seg. Eje Azimutal) / Bdm (Seg. Eje Polar))-1)*100
    
    PorGanaB_Azi_Pol = zeros(1,12); 
    
    for j=1:12
   
        PorGanaB_Azi_Pol(j)= (GanaB_Azi_Pol(j)-1)*100;
    
    end
    
%GANANCIAS RESPECTO A UN SEGUIMIENTO A UN EJE HORIZONTAL:::::::::::::::::::
%COCIENTE__________________________________________________________________
    %En "GanaB_Azi_Hor" se almacenan las ganancias de radiación para un
    %seguimiento a un eje azimutal respecto a un seguimiento a un eje horizontal 
    %Ganancia EjeAzimutal_Hor = Bdm (Seg. Eje Azimutal) / Bdm (Seg. Eje Horizontal)
    
    GanaB_Azi_Hor = zeros(1,12);
    
    for i=1:12
    
        GanaB_Azi_Hor(i)= BdEjeAzimutal(i) / BdEjeHorizontal(i);

    end
%PORCENTAJE________________________________________________________________     
    %En "PorGanaG_Azi_Hor" se almacenan las pérdidas calculadas en
    %porcentaje. 
    %Siendo Gananancia EjeAzimutal_Hor (%) = ((Gdm (Seg. Eje Azimutal) / Gdm (Seg. Eje Horizontal))-1)*100
    
    PorGanaB_Azi_Hor = zeros(1,12); 
    
    for j=1:12
   
        PorGanaB_Azi_Hor(j)= (GanaB_Azi_Hor(j)-1)*100;
    
    end


end

