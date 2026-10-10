function [GanaD_Azi_0, GanaD_Azi_Anu, GanaD_Azi_Est, GanaD_Azi_Pol, GanaD_Azi_Hor, PorGanaD_Azi_0, PorGanaD_Azi_Anu, PorGanaD_Azi_Est, PorGanaD_Azi_Pol, PorGanaD_Azi_Hor] = Ganancias_Dd_Azimutal(Val_Ddm0, Radiacion_Dd_Optima, DdOpt_Inv, DdOpt_Pri, DdOpt_Ver, DdOpt_Oto, DdEjePolar, DdEjeAzimutal, DdEjeHorizontal)

%GANANCIAS RESPECTO AL PLANO HORIZONTAL::::::::::::::::::::::::::::::::::::
%COCIENTE__________________________________________________________________
    %En "GanaD_Azi_0" se almacenan las ganancias de radiación para un
    %seguimiento a un eje azimutal respecto al plano horizontal. 
    %Ganancia EjeAzimutal_0 = Ddm (Seg. Eje Azimutal) / Ddm (0)
    
    GanaD_Azi_0 = zeros(1,12);
    
    for i=1:12
    
        GanaD_Azi_0(i)= DdEjeAzimutal(i) / Val_Ddm0(i);

    end
%PORCENTAJE________________________________________________________________     
    %En "PorGanaD_Azi_0" se almacenan las pérdidas calculadas en
    %porcentaje. 
    %Siendo Gananancia EjeAzimutal_0 (%) = ((Ddm (Seg. Eje Azimutal) / Ddm (0))-1)*100
    
    PorGanaD_Azi_0 = zeros(1,12); 
    
    for j=1:12
   
        PorGanaD_Azi_0(j)= (GanaD_Azi_0(j)-1)*100;
    
    end

%GANANCIAS RESPECTO A LA INCLINACIÓN ÓPTIMA ANUAL::::::::::::::::::::::::::
%COCIENTE__________________________________________________________________
    %En "GanaD_Azi_Anu" se almacenan las ganancias de radiación para un
    %seguimiento a un eje azimutal respecto a la inclinación óptima anual. 
    %Ganancia EjeAzimutal_Anu = Ddm (Seg. Eje Azimutal) / Ddm (Inc Opt Anual)
    
    GanaD_Azi_Anu = zeros(1,12);
    
    for i=1:12
    
        GanaD_Azi_Anu(i)= DdEjeAzimutal(i) / Radiacion_Dd_Optima(i);

    end
%PORCENTAJE________________________________________________________________     
    %En "PorGanaD_Azi_Anu" se almacenan las pérdidas calculadas en
    %porcentaje. 
    %Siendo Gananancia EjeAzimutal_Anu (%) = ((Ddm (Seg. Eje Azimutal) / Ddm (Inc Opt Anual))-1)*100
    
    PorGanaD_Azi_Anu = zeros(1,12); 
    
    for j=1:12
   
        PorGanaD_Azi_Anu(j)= (GanaD_Azi_Anu(j)-1)*100;
    
    end

%GANANCIAS RESPECTO A LA INCLINACIÓN ÓPTIMA ESTACIONAL:::::::::::::::::::::
%Ya que están en variables independientes las DdOpt de cada estación, se
%almacenan en RadiacionG_optima_Est todos. Pero OJO con diciembre

RadiacionD_optima_Est = zeros(1,12);

RadiacionD_optima_Est(12)= DdOpt_Inv(1); %Diciembre
RadiacionD_optima_Est(1)= DdOpt_Inv(2); %Enero
RadiacionD_optima_Est(2)= DdOpt_Inv(3); %Febero

RadiacionD_optima_Est(3)= DdOpt_Pri(1); %Marzo
RadiacionD_optima_Est(4)= DdOpt_Pri(2); %Abril
RadiacionD_optima_Est(5)= DdOpt_Pri(3); %Mayo

RadiacionD_optima_Est(6)= DdOpt_Ver(1); %Junio
RadiacionD_optima_Est(7)= DdOpt_Ver(2); %Julio
RadiacionD_optima_Est(8)= DdOpt_Ver(3); %Agosto

RadiacionD_optima_Est(9)= DdOpt_Oto(1); %Septiembre
RadiacionD_optima_Est(10)= DdOpt_Oto(2); %Octubre
RadiacionD_optima_Est(11)= DdOpt_Oto(3); %Noviembre

%COCIENTE__________________________________________________________________
    %En "GanaD_Azi_Est" se almacenan las ganancias de radiación para un
    %seguimiento a un eje azimutal respecto a la inclinación óptima estacional. 
    %Ganancia EjeAzimutal_Est = Ddm (Seg. Eje Azimutal) / Ddm (Inc Opt Estacional)
    
    GanaD_Azi_Est = zeros(1,12);
    
    for i=1:12
    
        GanaD_Azi_Est(i)= DdEjeAzimutal(i) / RadiacionD_optima_Est(i);

    end
%PORCENTAJE________________________________________________________________     
    %En "PorGanaB_Azi_Est" se almacenan las pérdidas calculadas en
    %porcentaje. 
    %Siendo Gananancia EjeAzimutal_Est (%) = ((Bdm (Seg. Eje Azimutal) / Bdm (Inc Opt Estacional))-1)*100
    
    PorGanaD_Azi_Est = zeros(1,12); 
    
    for j=1:12
   
        PorGanaD_Azi_Est(j)= (GanaD_Azi_Est(j)-1)*100;
    
    end    
        
  
%GANANCIAS RESPECTO A UN SEGUIMIENTO A UN EJE POLAR::::::::::::::::::::::::
%COCIENTE__________________________________________________________________
    %En "GanaD_Azi_Pol" se almacenan las ganancias de radiación para un
    %seguimiento a un eje azimutal respecto a un seguimiento a un eje polar
    %Ganancia EjeAzimutal_Pol = Ddm (Seg. Eje Azimutal) / Ddm (Seg. Eje Polar)
    
    GanaD_Azi_Pol = zeros(1,12);
    
    for i=1:12
    
        GanaD_Azi_Pol(i)= DdEjeAzimutal(i) / DdEjePolar(i);

    end
%PORCENTAJE________________________________________________________________     
    %En "PorGanaD_Azi_Pol" se almacenan las pérdidas calculadas en
    %porcentaje. 
    %Siendo Gananancia EjeAzimutal_Pol (%) = ((Ddm (Seg. Eje Azimutal) / Ddm (Seg. Eje Polar))-1)*100
    
    PorGanaD_Azi_Pol = zeros(1,12); 
    
    for j=1:12
   
        PorGanaD_Azi_Pol(j)= (GanaD_Azi_Pol(j)-1)*100;
    
    end
    
%GANANCIAS RESPECTO A UN SEGUIMIENTO A UN EJE HORIZONTAL:::::::::::::::::::
%COCIENTE__________________________________________________________________
    %En "GanaD_Azi_Hor" se almacenan las ganancias de radiación para un
    %seguimiento a un eje azimutal respecto a un seguimiento a un eje horizontal 
    %Ganancia EjeAzimutal_Hor = Ddm (Seg. Eje Azimutal) / Ddm (Seg. Eje Horizontal)
    
    GanaD_Azi_Hor = zeros(1,12);
    
    for i=1:12
    
        GanaD_Azi_Hor(i)= DdEjeAzimutal(i) / DdEjeHorizontal(i);

    end
%PORCENTAJE________________________________________________________________     
    %En "PorGanaD_Azi_Hor" se almacenan las pérdidas calculadas en
    %porcentaje. 
    %Siendo Gananancia EjeAzimutal_Hor (%) = ((Ddm (Seg. Eje Azimutal) / Ddm (Seg. Eje Horizontal))-1)*100
    
    PorGanaD_Azi_Hor = zeros(1,12); 
    
    for j=1:12
   
        PorGanaD_Azi_Hor(j)= (GanaD_Azi_Hor(j)-1)*100;
    
    end

end

