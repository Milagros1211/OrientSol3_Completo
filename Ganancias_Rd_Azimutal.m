function [GanaR_Azi_0, GanaR_Azi_Anu, GanaR_Azi_Est, GanaR_Azi_Pol, GanaR_Azi_Hor, PorGanaR_Azi_0, PorGanaR_Azi_Anu, PorGanaR_Azi_Est, PorGanaR_Azi_Pol, PorGanaR_Azi_Hor] = Ganancias_Rd_Azimutal(Radiacion_Rd_Optima, RdOpt_Inv, RdOpt_Pri, RdOpt_Ver, RdOpt_Oto, RdEjePolar, RdEjeAzimutal, RdEjeHorizontal)

%GANANCIAS RESPECTO AL PLANO HORIZONTAL::::::::::::::::::::::::::::::::::::
%COCIENTE__________________________________________________________________
    %En "GanaR_Azi_0" se almacenan las ganancias de radiación para un
    %seguimiento a un eje azimutal respecto al plano horizontal. 
    %Ganancia EjeAzimutal_0 = Rdm (Seg. Eje Azimutal) / Rdm (0) = inf
    
    GanaR_Azi_0 = zeros(1,12);
    
    for i=1:12
    
        GanaR_Azi_0(i)= RdEjeAzimutal(i) / 0;

    end
%PORCENTAJE________________________________________________________________     
    %En "PorGanaR_Azi_0" se almacenan las pérdidas calculadas en
    %porcentaje. 
    %Siendo Gananancia EjeAzimutal_0 (%) = ((Rdm (Seg. Eje Azimutal) / Rdm (0))-1)*100
    
    PorGanaR_Azi_0 = zeros(1,12); 
    
    for j=1:12
   
        PorGanaR_Azi_0(j)= (GanaR_Azi_0(j)-1)*100;
    
    end

%GANANCIAS RESPECTO A LA INCLINACIÓN ÓPTIMA ANUAL::::::::::::::::::::::::::
%COCIENTE__________________________________________________________________
    %En "GanaR_Azi_Anu" se almacenan las ganancias de radiación para un
    %seguimiento a un eje azimutal respecto a la inclinación óptima anual. 
    %Ganancia EjeAzimutal_Anu = Rdm (Seg. Eje Azimutal) / Rdm (Inc Opt Anual)
    
    GanaR_Azi_Anu = zeros(1,12);
    
    for i=1:12
    
        GanaR_Azi_Anu(i)= RdEjeAzimutal(i) / Radiacion_Rd_Optima(i);

    end
%PORCENTAJE________________________________________________________________     
    %En "PorGanaR_Azi_Anu" se almacenan las pérdidas calculadas en
    %porcentaje. 
    %Siendo Gananancia EjeAzimutal_Anu (%) = ((Rdm (Seg. Eje Azimutal) / Rdm (Inc Opt Anual))-1)*100
    
    PorGanaR_Azi_Anu = zeros(1,12); 
    
    for j=1:12
   
        PorGanaR_Azi_Anu(j)= (GanaR_Azi_Anu(j)-1)*100;
    
    end

%GANANCIAS RESPECTO A LA INCLINACIÓN ÓPTIMA ESTACIONAL:::::::::::::::::::::
%Ya que están en variables independientes las DdOpt de cada estación, se
%almacenan en RadiacionG_optima_Est todos. Pero OJO con diciembre

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

%COCIENTE__________________________________________________________________
    %En "GanaD_Azi_Est" se almacenan las ganancias de radiación para un
    %seguimiento a un eje azimutal respecto a la inclinación óptima estacional. 
    %Ganancia EjeAzimutal_Est = Ddm (Seg. Eje Azimutal) / Ddm (Inc Opt Estacional)
    
    GanaR_Azi_Est = zeros(1,12);
    
    for i=1:12
    
        GanaR_Azi_Est(i)= RdEjeAzimutal(i) / RadiacionR_optima_Est(i);

    end
%PORCENTAJE________________________________________________________________     
    %En "PorGanaB_Azi_Est" se almacenan las pérdidas calculadas en
    %porcentaje. 
    %Siendo Gananancia EjeAzimutal_Est (%) = ((Bdm (Seg. Eje Azimutal) / Bdm (Inc Opt Estacional))-1)*100
    
    PorGanaR_Azi_Est = zeros(1,12); 
    
    for j=1:12
   
        PorGanaR_Azi_Est(j)= (GanaR_Azi_Est(j)-1)*100;
    
    end    
        
    
%GANANCIAS RESPECTO A UN SEGUIMIENTO A UN EJE POLAR::::::::::::::::::::::::
%COCIENTE__________________________________________________________________
    %En "GanaR_Azi_Pol" se almacenan las ganancias de radiación para un
    %seguimiento a un eje azimutal respecto a un seguimiento a un eje polar
    %Ganancia EjeAzimutal_Pol = Rdm (Seg. Eje Azimutal) / Rdm (Seg. Eje Polar)
    
    GanaR_Azi_Pol = zeros(1,12);
    
    for i=1:12
    
        GanaR_Azi_Pol(i)= RdEjeAzimutal(i) / RdEjePolar(i);

    end
%PORCENTAJE________________________________________________________________     
    %En "PorGanaR_Azi_Pol" se almacenan las pérdidas calculadas en
    %porcentaje. 
    %Siendo Gananancia EjeAzimutal_Pol (%) = ((Rdm (Seg. Eje Azimutal) / Rdm (Seg. Eje Polar))-1)*100
    
    PorGanaR_Azi_Pol = zeros(1,12); 
    
    for j=1:12
   
        PorGanaR_Azi_Pol(j)= (GanaR_Azi_Pol(j)-1)*100;
    
    end
    
%GANANCIAS RESPECTO A UN SEGUIMIENTO A UN EJE HORIZONTAL:::::::::::::::::::
%COCIENTE__________________________________________________________________
    %En "GanaR_Azi_Hor" se almacenan las ganancias de radiación para un
    %seguimiento a un eje azimutal respecto a un seguimiento a un eje horizontal 
    %Ganancia EjeAzimutal_Hor = Rdm (Seg. Eje Azimutal) / Rdm (Seg. Eje Horizontal)
    
    GanaR_Azi_Hor = zeros(1,12);
    
    for i=1:12
    
        GanaR_Azi_Hor(i)= RdEjeAzimutal(i) / RdEjeHorizontal(i);

    end
%PORCENTAJE________________________________________________________________     
    %En "PorGanaR_Azi_Hor" se almacenan las pérdidas calculadas en
    %porcentaje. 
    %Siendo Gananancia EjeAzimutal_Hor (%) = ((Rdm (Seg. Eje Azimutal) / Rdm (Seg. Eje Horizontal))-1)*100
    
    PorGanaR_Azi_Hor = zeros(1,12); 
    
    for j=1:12
   
        PorGanaR_Azi_Hor(j)= (GanaR_Azi_Hor(j)-1)*100;
    
    end


end

