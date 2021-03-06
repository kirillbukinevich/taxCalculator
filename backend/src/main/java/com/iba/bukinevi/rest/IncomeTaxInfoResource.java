package com.iba.bukinevi.rest;

import com.iba.bukinevi.domain.IncomeTax;
import com.iba.bukinevi.rest.util.HeaderUtil;
import com.iba.bukinevi.service.IncomeTaxService;
import com.iba.bukinevi.service.dto.IncomeTaxDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.inject.Inject;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.stream.Collectors;

import static org.springframework.http.HttpStatus.OK;
import static org.springframework.web.bind.annotation.RequestMethod.POST;

@RestController
public class IncomeTaxInfoResource {
    private final Logger log = LoggerFactory.getLogger(IncomeTaxInfoResource.class);

    @Inject
    private IncomeTaxService incomeTaxService;

    /**
     * GET  /incomeTax : get all income taxes.
     *
     * @return the ResponseEntity with status 200 (OK) and with body all income taxes
     */
    @RequestMapping(value = "/incomeTax",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<IncomeTaxDTO>> getAllIncomeTax() {
        log.debug("REST request get all Goods");
        List<IncomeTaxDTO> taxDTOList = incomeTaxService.getAllIncomeTax()
                .stream().map(IncomeTaxDTO::new).collect(Collectors.toList());

        HttpHeaders headers = HeaderUtil.createAlert("incomeTax.getAll", null);
        return new ResponseEntity<>(taxDTOList, headers, OK);
    }

    /**
     * POST  /incomeTax  : Creates a new income tax.
     * @param incomeTaxDTO the income tax to create
     * @return the ResponseEntity with status 201 (Created) and with body the new income tax
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @RequestMapping(value = "/incomeTax",
            method = POST,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> saveIncomeTax(@RequestBody IncomeTaxDTO incomeTaxDTO) throws URISyntaxException {
        log.debug("REST request to save person info : {}", incomeTaxDTO);
        IncomeTax incomeTax = incomeTaxService.createUser(incomeTaxDTO);
        return ResponseEntity.created(new URI("/api/incomeTax/" + incomeTax.getId()))
                .headers(HeaderUtil.createAlert(String.valueOf(incomeTax.getId()), "personInfoManagement.created"))
                .body(incomeTax);
    }
}

